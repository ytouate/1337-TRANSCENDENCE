import {
    InternalServerErrorException,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Notification, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ namespace: 'notification', cors: { origin: '*' } })
export class NotificationService
    implements OnGatewayConnection, OnGatewayDisconnect
{
    socketById: Map<number, Socket[]>;
    constructor(
        private jwtService: JwtService,
        private prismaServie: PrismaService,
    ) {
        this.socketById = new Map<number, Socket[]>();
    }
    //disconnect client by delete socket from map
    handleDisconnect(client: Socket) {
        this.changeActivityStatusToOffline(client);
    }
    // make user offline and delete socket from map
    async changeActivityStatusToOffline(client: Socket) {
        const userObj: any = this.jwtService.verify(
            client.handshake.headers.authorization.slice(7),
        );
        const user = await this.prismaServie.user.update({
            where: {
                email: userObj.email,
            },
            data: {
                activitystatus: 'OFFLINE',
            },
        });
        this.socketById.delete(user.id);
    }
    //get socket from connecting clients
    handleConnection(client: Socket) {
        this.pushClientInMap(client);
    }

    //get the sending message
    @UseGuards(AuthGuard('websocket-jwt'))
    @SubscribeMessage('send_notification')
    async getNotification(@MessageBody() body: any, @Req() req) {
        const notifcation = await this.pushNotificationToDb(body, req);
        this.sendNotification(notifcation, req);
    }
    //send notification to the target
    async sendNotification(notification, req) {
        const notif: any = await this.prismaServie.notification.findUnique({
            where: {
                id: notification.id,
            },
            include: {
                reicever: true,
            },
        });
        const sender = await this.prismaServie.user.findFirst({
            where: {
                id: notif.senderId,
            },
        });
        if (this.socketById.has(notif.reiceverId)) {
            for (
                let i = 0;
                i < this.socketById.get(notif.reiceverId).length;
                i++
            ) {
                this.socketById
                    .get(notif.reiceverId)
                    [i].emit('receive_notification', notif);
            }
        }
    }
    //push notification to database
    async pushNotificationToDb(notificationBody, req) {
        const sender = await this.prismaServie.user.findUnique({
            where: {
                email: req.user.email,
            },
        });
        const reicever = await this.prismaServie.user.findUnique({
            where: {
                username: notificationBody.username,
            },
        });
        let notification: Notification =
            await this.prismaServie.notification.create({
                data: {
                    senderId: sender.id,
                    description: notificationBody.description,
                    title: notificationBody.title,
                    reiceverId: reicever.id,
                },
            });

        return notification;
    }
    //push the client socket in map
    async pushClientInMap(client: Socket) {
        try {
            const userObj: any = this.jwtService.verify(
                client.handshake.headers.authorization.slice(7),
            );
            const user: User = await this.prismaServie.user.findFirst({
                where: {
                    email: userObj.email,
                },
            });
            if (!this.socketById.has(user.id))
                this.socketById.set(user.id, [client]);
            else this.socketById.get(user.id).push(client);
            await this.prismaServie.user.update({
                where: {
                    email: userObj.email,
                },
                data: {
                    activitystatus: 'ONLINE',
                },
            });
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
    //accept or reject friend request and send acceptation
    @UseGuards(AuthGuard('websocket-jwt'))
    @SubscribeMessage('answer_notification')
    async answerToNotification(@MessageBody() body: any, @Req() req) {
        if (body.status == 'accept') {
            let notification = await this.acceptNotificaion(body);
            this.deleteNotification(body);
            let acceptation = {
                title: notification.title,
                reicever: notification.reicever,
                status: 'accepted',
            };
            for (
                let i = 0;
                i < this.socketById.get(notification.reicever.id).length;
                i++
            ) {
                this.socketById
                    .get(notification.senderId)
                    [i].emit('receive_notification', acceptation);
            }
        } else if (body.status == 'reject') this.deleteNotification(body);
    }
    // delete notifiation from database
    async deleteNotification(messageBody) {
        let notif = await this.prismaServie.notification.findFirst({
            where: {
                id: messageBody.id,
            },
        });
        await this.prismaServie.notification.deleteMany({
            where: {
                senderId: notif.senderId,
                reiceverId: notif.reiceverId,
                title: notif.title,
            },
        });
    }
    //accept notification
    async acceptNotificaion(messageBody) {
        let notification = await this.prismaServie.notification.findUnique({
            where: {
                id: messageBody.id,
            },
            include: {
                reicever: true,
            },
        });
        await this.prismaServie.user.update({
            where: {
                id: notification.senderId,
            },
            data: {
                friends: {
                    connect: {
                        id: notification.reicever.id,
                    },
                },
            },
        });
        await this.prismaServie.user.update({
            where: {
                id: notification.reicever.id,
            },
            data: {
                friends: {
                    connect: {
                        id: notification.senderId,
                    },
                },
            },
        });
        return notification;
    }
}
