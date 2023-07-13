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

    private socketId : Map<string , string> = new Map()

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
        const user = await this.validateUserByEmail(req.user.email, client.handshake.query.roomName)
        if (user)
        {
            const result = await this.user.joiningTheRoom(client.handshake.query, user);
            if (result == undefined)
                return 'incorect password'
            this.socketId.set(user.email, client.id)
            this.server.in(client.id).socketsJoin(client.handshake.query.roomName)
            this.user.addUserToRoom(user, client.handshake.query.roomName)      
            return `${user.username} has joined in ${client.handshake.query.roomName}`
        }
    }


    // leave the socket from room
    @SubscribeMessage('leaveRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async leaveRoomHandler(@ConnectedSocket() client: Socket, @Req() req) {
        const user = await this.validateUserByUsername(client.handshake.query.username)
        if (user)
        {
            const Id = this.socketId.get(user.email)
            this.socketId.delete(user.email)
            console.log(`client  ${Id} leave room ${client.handshake.query.roomName}`)
            this.server.in(Id).socketsLeave(client.handshake.query.roomName)
            this.user.deleteUserFromRoom(user , client.handshake.query.roomName)
        }
    }

    // if the user connect to the event
    async  handleConnection(client: Socket, ...args: any[]) {
        console.log(`client ${client.id} has connected`)
    }

    // if the user disconnect to the event
    async handleDisconnect(client: any) {
        console.log(`client ${client.id} has disconnect`)    
    }

    //check the user if exist 
    async validateUserByUsername(username) {
        return await this.prisma.user.findFirst({where : {username : username}})
    }

    //check the user if exist 
    async validateUserByEmail(email, roomName) {
        const user =  await this.prisma.user.findUnique({where : {email : email}})
        const room = await this.prisma.chatRoom.findFirst({ where : {roomName : roomName} })
        if (room.banUsers.indexOf(user.email) < 0)
            return user
    }

}
