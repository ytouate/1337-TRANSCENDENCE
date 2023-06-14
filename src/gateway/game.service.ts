import { OnModuleInit } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { BOARD_HEIGHT, PADDLE_HEIGHT } from './gamelogic/constants';
import { UserData, GamePosition } from './gamelogic/interfaces';
import { Game } from './gamelogic/Game';

@WebSocketGateway({ cors: true })
export class GameGateWay
    implements OnGatewayConnection, OnModuleInit
{
    userSockets: Map<number, UserData>;
    queue: number[];
    gamePlayerPosition: Map<number, GamePosition>;

    @WebSocketServer()
    server: Server;

    constructor(private prisma: PrismaService) {
        this.userSockets = new Map<number, UserData>();
        this.queue = [];
        this.gamePlayerPosition = new Map();
    }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log(socket.id);
        });
    }

    async handleConnection(@ConnectedSocket() client: Socket) {
        this.addClient(client);
    }

    getUserIdBySocket(socket: Socket): number | undefined {
        for (const [userId, userData] of this.userSockets) {
            if (userData.socket.id === socket.id) {
                return userId;
            }
        }
        return undefined;
    }

    removeClient(client: Socket) {
        const userId = this.getUserIdBySocket(client);

        if (userId) {
            this.userSockets.delete(userId);
            const index = this.queue.findIndex(
                (element) => element === userId,
            );
            if (index !== -1) {
                this.queue.splice(index, 1);
            }
            console.log(`Client with userId ${userId} disconnected`);
        }
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.removeClient(client);
    }

    async addClient(client: Socket) {
        const { userId } = client.handshake.query;

        const user = await this.prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
        });

        const userData: UserData = {
            socket: client,
            username: user.username,
            id: user.id,
        };

        //means player exists and belongs to the lobby
        if (!this.userSockets.has(user.id)) {
            console.log(`Client with userId ${userId} connected`);

            this.userSockets.set(user.id, userData);
        }
    }

    async matchPlayers(player1: number, player2: number) {
        // Get the sockets for the matched players
        const userData1 = this.userSockets.get(player1);
        const userData2 = this.userSockets.get(player2);

        if (!userData1 || !userData2) return;

        if (!userData1.socket || !userData2.socket) return;

        const game = await this.prisma.game.create({
            data: {
                players: {
                    connect: [{ id: player1 }, { id: player2 }],
                },
                playerOrder: player1,
            },
            include: {
                players: true,
            },
        });

        if (!game) throw new Error('Failed to create the game');

        const roomId = String(game.id);
        console.log('Joining Room:', roomId);

        userData1.socket.join(roomId);
        userData2.socket.join(roomId);

        console.log('emitting to user 1:');

        userData1.socket.emit('match_found', {
            gameId: game.id,
            opponent: userData2.username,
            pos: 'left',
        });
        console.log('emitting to user 2:');

        userData2.socket.emit('match_found', {
            gameId: game.id,
            opponent: userData1.username,
            pos: 'right',
        });

        this.gamePlayerPosition.set(game.id, {
            player1: {
                id: userData1.id,
                username: userData1.username,
                y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
                score: 0,
            },
            player2: {
                id: userData2.id,
                username: userData2.username,
                y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
                score: 0,
            },
        });

        // this.userSockets.delete(player1); // still dont know what to do with this
        // this.userSockets.delete(player2);

        const gamePosition = this.gamePlayerPosition.get(game.id);

        const gameInstance = new Game(
            game.id,
            userData1.socket,
            userData2.socket,
            gamePosition,
            game.createdAt,
        );
        gameInstance.startGameLoop(
            this.server,
            this.prisma,
            this.gamePlayerPosition,
        );
    }

    @SubscribeMessage('mouseMove')
    mouseMove(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {
        const { y, gameId, userId } = body;
        // const userId = this.getUserIdBySocket(client);

        const gamePositions = this.gamePlayerPosition.get(gameId);
        if (gamePositions) {
            if (userId == gamePositions.player1.id) {
                gamePositions.player1.y = y;
            } else if (userId == gamePositions.player2.id) {
                gamePositions.player2.y = y;
            }
        }
    }

    @SubscribeMessage('queueUp')
    async queueUp(@MessageBody() body: any) {
        const userId = body.userId;

        console.log('queueUp emitted from ' + userId);

        // if (!this.userSockets.has(userId)) return;

        this.queue.push(userId);
        // console.log({ id: userId, len: this.queue.length });
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.matchPlayers(player1, player2);
        }
    }

    @SubscribeMessage('invite')
    async invite() {}
}
