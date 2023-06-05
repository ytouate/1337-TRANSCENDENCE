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

@WebSocketGateway()
export class MyGateWay implements OnModuleInit, OnGatewayConnection {
    userSockets: Map<number, Socket>;

    constructor(private prisma: PrismaService) {
        this.userSockets = new Map<number, Socket>();
    }

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
        });
    }

    handleConnection(@ConnectedSocket() client: Socket) {
        this.addClient(client);
    }

    async addClient(client: Socket) {
        const lobbyId: number = Number(client.handshake.query.lobbyId);
        const userId: number = Number(client.handshake.query.userId);

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (user && user.lobbyId === lobbyId) {
            //means player exists and belongs to the lobby
            if (!this.userSockets.has(user.id))
                this.userSockets.set(user.id, client);
        }
    }

    // @SubscribeMessage('createLobby')
    // createLobby(client: Socket, lobbyName: String) {

    // }

    @SubscribeMessage('mousemove')
    handleMouseMove() {}

    @SubscribeMessage('joinLobby')
    async joinLobby(@MessageBody() body: any) {
        const userId = body.userId;
        const lobbyId = body.lobbyId;

        if (!this.userSockets.has(userId)) return;

        const lobby = await this.prisma.lobby.findFirst({
            where: {
                id: lobbyId,
            },
            include: { players: true },
        });
        if (!lobby) return;
        let userIn = false;
        var p2: User;
        for (const player of lobby.players) {
            if (userId === player.id) {
                userIn = true;
            } else {
                p2 = player;
            }
        }
        if (!userIn) return;
        if (lobby && lobby.players.length === 2) {
            this.userSockets.get(userId).emit('game_started');
            if (this.userSockets.has(p2.id))
                this.userSockets.get(p2.id).emit('game_started');
        }
    }

}
