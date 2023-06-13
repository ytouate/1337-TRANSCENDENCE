import { OnModuleInit, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket ,Server } from "socket.io";
import { PrismaService } from "src/Prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { Req } from "@nestjs/common";


@WebSocketGateway({ namespace : 'chat' , cors : true})
export class chatGateway  implements OnModuleInit , OnGatewayConnection , OnGatewayDisconnect {
    constructor (
        private prisma: PrismaService,
        private user: UserService
        ) {}

    @WebSocketServer()
    server : Server;

    // send message to current room
    @SubscribeMessage('sendMessage')
    @UseGuards(AuthGuard('websocket-jwt'))
    onMessage(@ConnectedSocket() client : Socket, @MessageBody() data , @Req() req)
    {
        this.server.in(client.handshake.query.roomName).emit('onMessage', data)
        this.user.putDataInDatabase(client.handshake.query.roomName, data, req.user)
    }

    onModuleInit() {
        
    }

    // joining the socket of user in  specific room
    @SubscribeMessage('joinRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async handle(@ConnectedSocket() client : Socket , @Req() req) {
        console.log(`client  ${client.id} connected and joining the room ${client.handshake.query.roomName}`)
        const user = await this.updateUser(req.user, client)
        if (user)
        {
            this.server.in(user.socketId).socketsJoin(client.handshake.query.roomName)
            this.user.addUserToRoom(user, client.handshake.query.roomName)      
        }
    }


    // leave the socket from room
    @SubscribeMessage('leaveRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async leaveRoomHandler(@ConnectedSocket() client: Socket, @Req() req) {
        console.log(`client  ${client.id}  leave room ${client.handshake.query.roomName}`)
        const user = await this.validateUser(req.user)
        if (user)
        {
            this.server.in(client.id).socketsLeave(client.handshake.query.roomName)
            this.user.deleteUserFromRoom(user , client.handshake.query.roomName)
        }
    }

    // add socket id of the user in database
    async updateUser(user , client)  {
        return  await this.prisma.user.update({
            where : {email : user.email} , 
            data : {socketId : client.id}
        })
    }

    // if the user connect to the event
    async  handleConnection(client: Socket, ...args: any[]) {
        console.log(`client ${client.id} has connected`)
    }

    // if the user disconnect to the event
    async handleDisconnect(client: any) {
        console.log(`client ${client.id} has disconnect`)    
    }

    //check the user if exist { by socketId }
    async validateUser(req) {
        return await this.prisma.user.findUnique(
            {where : {email : req.email}}
        )
    }

}
