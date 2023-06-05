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
export class GameGateWay implements OnGatewayConnection, OnModuleInit {
    userSockets: Map<number, Socket>;
    queue: number[];

    @WebSocketServer()
    server: Server;

    constructor(private prisma: PrismaService) {
        this.userSockets = new Map<number, Socket>();
        this.queue = [];
    }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
        });
    }

    handleConnection(@ConnectedSocket() client: Socket) {
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
            const index = this.queue.findIndex((element) => element === userId);
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
        if (!this.userSockets.has(user.id))
            this.userSockets.set(user.id, client);
    }

    matchPlayers(player1: number, player2: number) {
        // Get the sockets for the matched players
        const socket1 = this.userSockets.get(player1);
        const socket2 = this.userSockets.get(player2);

        if (socket1) socket1.emit('match_found', { opponentId: player2 });
        if (socket2) socket2.emit('match_found', { opponentId: player1 });

        this.userSockets.delete(player1);
        this.userSockets.delete(player2);
    }

    @SubscribeMessage('queueUp')
    queueUp(@MessageBody() body: any) {
        const userId = body.userId;

        console.log({ userId });

        if (!this.userSockets.has(userId)) return;

        this.queue.push(userId);
        // console.log({ id: userId, len: this.queue.length });
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.matchPlayers(player1, player2);
        }
    }
}
