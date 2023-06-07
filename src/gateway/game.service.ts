import { OnModuleInit, Req } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Lobby } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { log } from 'console';

@WebSocketGateway({ cors: true })
export class GameGateWay
    implements OnGatewayConnection, OnModuleInit
{
    userSockets: Map<number, Socket>;
    queue: number[];
    // rooms: Map<string, Set<string>>;

    @WebSocketServer()
    server: Server;

    constructor(private prisma: PrismaService) {
        this.userSockets = new Map<number, Socket>();
        this.queue = [];
        // this.rooms = new Map();
    }

    // joinRoom(socketId: string, roomId: string) {
    //     if (!this.rooms.has(roomId))
    //         this.rooms.set(roomId, new Set<string>());
    //     this.rooms.get(roomId)?.add(socketId);
    // }

    // leaveRoom(socketId: string, roomId: string) {
    //     if (this.rooms.has(roomId)) {
    //         const sockets = this.rooms.get(roomId);
    //         sockets?.delete(socketId);
    //         if (sockets?.size === 0) {
    //             this.rooms.delete(roomId);
    //         }
    //     }
    // }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log(socket.id);
        });
    }

    async handleConnection(@ConnectedSocket() client: Socket) {
        this.addClient(client);
    }

    getUserIdBySocket(socket: Socket): number | undefined {
        for (const [userId, client] of this.userSockets) {
            if (client.id === socket.id) {
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

        //means player exists and belongs to the lobby
        if (!this.userSockets.has(user.id)) {
            console.log(`Client with userId ${userId} connected`);
            this.userSockets.set(user.id, client);
        }
    }

    async matchPlayers(player1: number, player2: number) {
        // Get the sockets for the matched players
        const socket1 = this.userSockets.get(player1);
        const socket2 = this.userSockets.get(player2);

        const game = await this.prisma.game.create({
            data: {
                players: {
                    connect: [{ id: player1 }, { id: player2 }],
                },
            },
        });

        if (!game) throw new Error('Failed to create the game');

        const roomId = String(game.id);
        console.log('Joining Room:', roomId);

        socket1.join(roomId);
        socket2.join(roomId);

        // this.server.to(roomId).emit('match_found', {
        //     gameId: game.id,
        //     opponentId: player2,
        // });

        socket1.emit('match_found', {
            gameId: game.id,
            opponentId: player2,
            pos: 'left', // Custom data for player 1
        });

        socket2.emit('match_found', {
            gameId: game.id,
            opponentId: player1,
            pos: 'right', // Custom data for player 2
        });

        this.userSockets.delete(player1);
        this.userSockets.delete(player2);
    }

    getSocketByID(id: string): Socket | undefined {
        for (const [userId, socket] of this.userSockets) {
            if (socket.id === id) {
                return socket;
            }
        }
        return undefined;
    }

    @SubscribeMessage('mouseMove')
    mouseMove(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {
        const { x, y, gameId } = body;
        const roomId = String(gameId);

        client.to(roomId).emit('opponent_mousemove', { x, y });
    }

    @SubscribeMessage('queueUp')
    async queueUp(@MessageBody() body: any) {
        const userId = body.userId;

        // console.log({ userId });

        // if (!this.userSockets.has(userId)) return;

        this.queue.push(userId);
        // console.log({ id: userId, len: this.queue.length });
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.matchPlayers(player1, player2);
        }
    }
}
