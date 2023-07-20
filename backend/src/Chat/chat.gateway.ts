import { Body, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket ,Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { Req } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { userReturnToGatway } from "src/utils/user.return";
import { Client } from "socket.io/dist/client";

@WebSocketGateway({ namespace : 'chat' , cors: {origin : '*'} })
export class chatGateway  implements OnGatewayConnection , OnGatewayDisconnect {
    constructor (
        private prisma: PrismaService,
        private user: UserService,
        private jwt: JwtService
        ) {}

    @WebSocketServer()
    server : Server;

    private socketId : Map<string , string> = new Map()

    // send message to current room
    @SubscribeMessage('sendMessage')
    @UseGuards(AuthGuard('websocket-jwt'))
    async onMessage(client : Socket , @MessageBody() data , @Req() req)
    {
        const message = await this.user.putDataInDatabase(data.roomName, data.message, req)
        message.sender = userReturnToGatway(message.sender, req)
        console.log(message)
        this.server.in(data.roomName).emit('onMessage', message)
    }

    // joining the socket of user in  specific room
    @SubscribeMessage('createRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async handleCreationOfTheRoom(@ConnectedSocket() client : Socket , @Req() req, @MessageBody() Body) {
        console.log(`client  ${client.id} connected and creat the room ${Body.roomName}`)
        const user = await this.validateUserByEmail(req.user.email, Body.roomName, 0)
        if (user)
        {
            const {roomName , status, password} = Body
            const room = this.user.creatRoom({
                'roomName' : roomName ,
                'status'   : status ,
                'password' : password} , user)
            this.server.in(client.id).socketsJoin(Body.roomName)
            if (Body.username)
            {
                let id = this.socketId.get(Body.username)
                this.server.in(id).socketsJoin(Body.roomName)
            }
        }
    }

    // joining the socket of user in  specific room
    @SubscribeMessage('joinRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async handleJoiningTheRoom(@ConnectedSocket() client : Socket , @Req() req, @MessageBody() body) {
        console.log(`client  ${client.id} connected and joining the room ${body.roomName}`)
        const user = await this.validateUserByEmail(req.user.email, body.roomName, 1)
        if (user)
        {
            const result = await this.user.joiningTheRoom(body);
            if (result == undefined)
                throw new UnauthorizedException({}, '')
            if (result == false)
                throw new UnauthorizedException({}, '')
            this.server.in(client.id).socketsJoin(body.roomName)
            const newUpdateChat = this.user.addUserToRoom(user, body.roomName)      
            console.log(`${user.username} has joined in ${body.roomName}`)
        }
    }


    // leave the socket from room
    @SubscribeMessage('leaveRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async leaveRoomHandler(@Req() req, @MessageBody() body) {
        const user = await this.validateUserByUsername(body.username)
        if (user)
        {
            const Id = this.socketId.get(user.email)
            this.socketId.delete(user.email)
            console.log(`client  ${Id} leave room ${body.roomName}`)
            this.server.in(Id).socketsLeave(body.roomName)
            this.user.deleteUserFromRoom(user , body.roomName)
        }
    }

    // if the user connect to the event
    async  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        const payload = await this.jwt.verifyAsync(client.handshake.headers.authorization.slice(7))
        this.socketId.set(payload.username, client.id)
        console.log(`client ${client.id} has connected`)
    }

    // if the user disconnect to the event
    async handleDisconnect(client: any) {
        const payload = await this.jwt.verifyAsync(client.handshake.headers.authorization.slice(7))
        this.socketId.delete(payload.username)
        console.log(`client ${client.id} has disconnect`)    
    }

    //check the user if exist 
    async validateUserByUsername(username) {
        return await this.prisma.user.findFirst({where : {username : username}})
    }

    //check the user if exist 
    async validateUserByEmail(email, roomName, num) {
        const user =  await this.prisma.user.findUnique({where : {email : email}})
        const room = await this.prisma.chatRoom.findFirst({ where : {roomName : roomName} })
        if (num == 0)
            return user
        return room?.banUsers?.indexOf(user.email) < 0 ? user : undefined
    }

}
