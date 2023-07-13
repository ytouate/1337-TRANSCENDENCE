import { InternalServerErrorException, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Notification, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/Prisma/prisma.service';


@WebSocketGateway({namespace: 'notification', cors: true})
export class NotificationService implements OnGatewayConnection, OnGatewayDisconnect{
    socketById: Map<number, Socket[]> ;
    constructor(private jwtService: JwtService, private prismaServie: PrismaService){
        this.socketById = new Map<number, Socket[]>();
    }
    //disconnect client by delete socket from map
    handleDisconnect(client: Socket) {
        this.changeActivityStatusToOffline(client)
    }
   // make user offline and delete socket from map
    async changeActivityStatusToOffline(client: Socket){
        const userObj: any = this.jwtService.verify(client.handshake.headers.authorization.slice(7));
        const user: User = await this.prismaServie.user.findFirst({
            where: {
                username: userObj.username
            }
        })
        this.prismaServie.user.update({
            where: {
                username: userObj.username,
            },
            data: {
                activitystatus: true,
            }
        })
        this.socketById.delete(user.id);
    }
    //get socket from connecting clients
    handleConnection(client: Socket) {
        this.pushClientInMap(client);
    }

    //get the sending message
    @UseGuards(AuthGuard('websocket-jwt'))
    @SubscribeMessage('send_notification')
    async getNotification(@MessageBody() body: any, @Req() req){
        const notifcation = await this.pushNotificationToDb(body, req)
        this.sendNotification(notifcation)
    }
    //send notification to the target
    async sendNotification(notification){
        const notif = await this.prismaServie.notification.findUnique({
            where: {
                id : notification.id
            },
            include:{
                senderAndReicever: true,
            }
        })
        notification.sender = notif.senderAndReicever[0];
        if (this.socketById.has(notif.senderAndReicever[1]?.id)){
            for (let i = 0;i < this.socketById.get(notif.senderAndReicever[1].id).length;i++){
                this.socketById.get(notif.senderAndReicever[1].id)[i].emit('receive_notification', notification);
            }
        }
    }
    //push notification to database
    async pushNotificationToDb(notificationBody, req){
        const sender = await this.prismaServie.user.findUnique({
            where: {
                username: req.user.username,
            }
        })
        const reicever = await this.prismaServie.user.findUnique({
            where: {
                username: notificationBody.username
            }
        })
        let userIds = [sender.id, reicever.id]
        let notification: Notification = await this.prismaServie.notification.create({
            data: {
                description: notificationBody.description,
                title: notificationBody.title,
                senderAndReicever: {
                    connect: userIds.map((id) => ({id})),
                },
            }
        });
        
        return notification;
    }
    //push the client socket in map
    async pushClientInMap(client: Socket){
        try{
            const userObj: any = this.jwtService.verify(client.handshake.headers.authorization.slice(7));
            const user: User = await this.prismaServie.user.findFirst({
                where: {
                    username: userObj.username
                }
            })
            if (!this.socketById.has(user.id))
                this.socketById.set(user.id, [client]);
            else
                this.socketById.get(user.id).push(client);
            await this.prismaServie.user.update({
                where: {
                    username: userObj.username,
                },
                data: {
                    activitystatus: true,
                }
            })
        }
        catch(erro){
            client.disconnect();
        }
    }
    //accept or reject friend request and send acceptation
    @UseGuards(AuthGuard('websocket-jwt'))
    @SubscribeMessage('answer_notification')
    async answerToNotification(@MessageBody() body: any, @Req() req){
        if (body.status == 'accepted'){
            let notification = await this.acceptNotificaion(body);
            this.deleteNotification(body);
            let acceptation = {
                title: notification.title,
                reicever: notification.senderAndReicever[1].username,
                status: 'accepted'
            }
            for (let i = 0;i < this.socketById.get(notification.senderAndReicever[1].id).length;i++){
                this.socketById.get(notification.senderAndReicever[0].id)[i].emit('receive_notification', acceptation);
            }
        }
        else if (body.status == 'rejected') this.deleteNotification(body);
    }
    // delete notifiation from database
    deleteNotification(messageBody){
        try{
        this.prismaServie.notification.delete({
            where : {
                id: messageBody.id,
            }
        })}
        catch(error){
            throw new InternalServerErrorException();
        }
    }
    //accept notification
    async acceptNotificaion(messageBody){
        try{
            let notification = await this.prismaServie.notification.findUnique({
                where:{
                    id: messageBody.id,
                },
                include: {
                    senderAndReicever: true
                }
            })
            await this.prismaServie.user.update({
                where: {
                    id: notification.senderAndReicever[0].id
                },
                data: {
                    friends:{
                        connect: {
                            id: notification.senderAndReicever[1].id
                        }
                    }
                }
            })
            await this.prismaServie.user.update({
                where: {
                    id: notification.senderAndReicever[1].id
                },
                data: {
                    friends:{
                        connect: {
                            id: notification.senderAndReicever[0].id
                        }
                    }
                }
            })
            return notification;
        }
        catch(error){
            throw new InternalServerErrorException();
        }
    }
}
