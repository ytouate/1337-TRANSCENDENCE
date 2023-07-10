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
import { BOARD_HEIGHT, PADDLE_HEIGHT } from './gamelogic/constants';
import {
    UserData,
    GamePosition,
    PlayerPosition,
} from './gamelogic/interfaces';
import { Game } from './gamelogic/Game';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { PrefService } from 'src/pref/pref.service';

@WebSocketGateway({ cors: true })
export class GameGateWay
    implements OnGatewayConnection, OnModuleInit
{
    userSockets: Map<number, UserData>;
    queue: number[];
    gamePlayerPosition: Map<number, GamePosition>;

    @WebSocketServer()
    server: Server;

    constructor(
        private userService: UserService,
        private gameService: GameService,
        private prefService: PrefService,
    ) {
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
        // console.log('handleConnection');
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

        const user = await this.userService.getUserById(
            Number(userId),
        );

        if (!user) return;

        const userData: UserData = {
            socket: client,
            username: user.username,
            id: user.id,
            // pref: user.preference,
        };

        //means player exists
        console.log(`Client with userId ${userId} connected`);

        this.userSockets.set(user.id, userData);
    }

    async matchPlayers(
        player1: number,
        player2: number,
        gameInvite: boolean,
    ) {
        // Get the sockets for the matched players
        const userData1 = this.userSockets.get(player1);
        const userData2 = this.userSockets.get(player2);

        if (!userData1 || !userData2) return;

        if (!userData1.socket || !userData2.socket) return;

        const game = await this.gameService.createGame({
            player1,
            player2,
        });

        if (!game) throw new Error('Failed to create the game');

        const roomId = String(game.id);
        console.log('Joining Room:', roomId);

        userData1.socket.join(roomId);
        userData2.socket.join(roomId);

        console.log('emitting to user 1:');

        console.log('emitting to user 2:');

        const event_name = gameInvite
            ? 'game_invite_start'
            : 'match_found';

        const pref1 = await this.prefService.getUserPref(
            userData1.id,
        );
        const pref2 = await this.prefService.getUserPref(
            userData2.id,
        );

        userData1.socket.emit(event_name, {
            gameId: game.id,
            opponent: userData2.username,
            order: 0,
            pref: pref1,
            pref2: pref2,
        });

        userData2.socket.emit(event_name, {
            gameId: game.id,
            opponent: userData1.username,
            order: 1,
            pref: pref2,
            pref2: pref1,
        });

        const players: PlayerPosition[] = new Array(2);

        players[0] = {
            id: userData1.id,
            username: userData1.username,
            y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            score: 0,
        };
        player1[1] = {
            id: userData2.id,
            username: userData2.username,
            y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            score: 0,
        };

        this.gamePlayerPosition.set(game.id, { players });

        const gamePosition = this.gamePlayerPosition.get(game.id);

        const gameInstance = new Game(
            game.id,
            userData1.socket,
            userData2.socket,
            gamePosition,
            game.createdAt,
            this.gameService,
            this.userService,
        );
        gameInstance.startGameLoop(
            this.server,
            this.gamePlayerPosition,
        );
    }

    @SubscribeMessage('mouseMove')
    mouseMove(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {
        const { y, gameId, userId, order } = body;

        const gamePositions = this.gamePlayerPosition.get(gameId);
        if (gamePositions) {
            
            gamePositions.players[order].y = y * BOARD_HEIGHT;
            const roomId = String(gameId);
            client.broadcast.to(roomId).emit('opponent_mousemove', { y });
        }
    }

    @SubscribeMessage('queueUp')
    async queueUp(@MessageBody() body: any) {
        const userId = body.userId;

        if (this.queue.includes(userId)) {
            console.log('User already in the queue');
            return;
        }
        this.queue.push(userId);
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.matchPlayers(player1, player2, false);
        }
    }

    @SubscribeMessage('gameInvite')
    async gameInvite(@MessageBody() body: any) {
        const userId: number = body.userId;
        const opponentUsername: string = body.opponentUsername;

        // const opponent = await this.prisma.user.findUnique({
        //     where: {
        //         username: opponentUsername,
        //     },
        // });

        const opponent = await this.userService.getUserByUsername(
            opponentUsername,
        );
        if (!opponent) {
            console.log('opponent not found');
            return;
        }

        const opponentData = this.userSockets.get(opponent.id);
        if (!opponentData) return;
        const myData = this.userSockets.get(userId);
        if (opponentData.id === myData.id) {
            console.log('inviting userself retard ?');
            return;
        }

        // const senderInfo = await this.prisma.user.findUnique({
        //     where: {
        //         id: myData.id,
        //     },
        // });

        const senderInfo = await this.userService.getUserById(userId);

        if (!senderInfo) {
            console.log('huh u dont exist');
            return;
        }

        myData.socket.to(opponentData.socket.id).emit('invite', {
            senderInfo: senderInfo,
        });
    }

    @SubscribeMessage('inviteResponse')
    async inviteResponse(@MessageBody() body: any) {
        const userId: number = body.userId;
        const opponentId: number = body.opponentId;
        const status: string = body.status;

        if (status === 'accepted') {
            // this.matchPlayers(opponent.id, userId);
            console.log('players matched');
            await new Promise(() => {
                setTimeout(() => {
                    this.matchPlayers(opponentId, userId, true);
                }, 1000);
            });
        } else if (status === 'declined') {
            console.log('player declined');
            const myData = this.userSockets.get(userId);
            const opponentData = this.userSockets.get(opponentId);
            if (myData) {
                myData.socket
                    .to(opponentData.socket.id)
                    .emit('invite_response', {
                        userId: userId,
                        username: myData.username,
                        status: 'declined',
                    });
            }
        }
    }
}
