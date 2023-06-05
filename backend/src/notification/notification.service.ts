import { Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';


@WebSocketGateway()
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
    sendNotification(notification){
        if (this.socketByID.has(notification.receiverId)){
            for (let i = 0;i < this.socketByID.get(notification.receiverId).length;i++){
                this.socketByID.get(notification.receiverId)[i].emit('receive_notification', notification);
            }
        }
    }

    //push notification to database
    async pushNotificationToDb(notificationBody, req){
        const user = await this.prismaServie.user.findFirst({
            where: {
                username: notificationBody.username
            }
        })
        const notifcation = await this.prismaServie.notification.create({
            data: {
                description: notificationBody.description,
                sender: req.user.username,
                title: notificationBody.title,
                reicever: {
                    connect: {id: user.id}
                },
            }
        })
        return notifcation;
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
}
