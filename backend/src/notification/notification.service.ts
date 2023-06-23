import { InternalServerErrorException, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Notification, User } from '@prisma/client';
import { log } from 'console';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/Prisma/prisma.service';


@WebSocketGateway({namespace: 'notification', cors: true})
export class NotificationService {
    socketByID: Map<number, Socket[]> ;
    constructor(private jwtService: JwtService, private prismaServie: PrismaService){
        this.socketByID = new Map<number, Socket[]>();
    }
   
    //get socket for connecting clients
    handleConnection(@ConnectedSocket() client: Socket) {
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
        if (this.socketByID.has(notif.senderAndReicever[1]?.id)){
            for (let i = 0;i < this.socketByID.get(notif.senderAndReicever[1].id).length;i++){
                this.socketByID.get(notif.senderAndReicever[1].id)[i].emit('receive_notification', notification);
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
            if (!this.socketByID.has(user.id))
                this.socketByID.set(user.id, [client]);
            else
                this.socketByID.get(user.id).push(client);
        }
        catch(erro){
            client.disconnect();
        }
    }
    //accept or reject friend request
    @UseGuards(AuthGuard('websocket-jwt'))
    @SubscribeMessage('answer_notification')
    async answerToNotification(@MessageBody() body: any, @Req() req){
        console.log(body);
        if (body.status == 'accepted'){
            await this.acceptNotificaion(body);
            this.deleteNotification(body);
        }
        else if (body.status == 'rejected') this.deleteNotification(body);
    }
    // delete notifiation from database
    deleteNotification(messageBody){
        this.prismaServie.notification.delete({
            where : {
                id: messageBody.id,
            }
        })
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
        }
        catch(error){
            throw new InternalServerErrorException();
        }
    }
}
