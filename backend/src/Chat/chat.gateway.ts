import { Body, OnModuleInit, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket ,Server } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { Req } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { userReturnToGatway } from "src/utils/user.return";
import { Client } from "socket.io/dist/client";
import { use } from "passport";
import { chownSync } from "fs";
import { concatAll } from "rxjs";

@WebSocketGateway({ namespace : 'chat' , cors: {origin : '*'} })
export class chatGateway  implements OnModuleInit ,  OnGatewayConnection , OnGatewayDisconnect {
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
    async onMessage(client : Socket , @MessageBody() Body , @Req() req)
    {
        const id = this.socketId.get(req.user.email)
        this.server.to(id).socketsJoin(Body.roomName)
        for (const email of Body.email)
        {
            const newId = this.socketId.get(email)
            this.server.to(newId).socketsJoin(Body.roomName)
        }
        const message = await this.user.putDataInDatabase(Body.roomName, Body.data, req)
        message.sender = userReturnToGatway(message.sender, req);
        message.roomName = Body.roomName;
        this.server.to(Body.roomName).emit('onMessage', message)
    }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log(socket.id);
        });
    }


    @SubscribeMessage('createRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async handleCreationOfTheRoom(@ConnectedSocket() client : Socket , @Req() req, @MessageBody() Body) {
        console.log(`client  ${client.id} connected and creat the room ${Body.roomName}`)
        let userAddToRoom  : any;
        const User = await this.validateUserByEmail(req.user.email, Body.roomName, 0)
        if (User)
        {
            let {found, room} = await this.user.creatRoom( User, Body)
            let newRoom = await this.prisma.chatRoom.findUnique({where : {id : room.id} , include : {messages : true , users : true}})
            console.log({found , room})
            if (!found)
            {
                console.log(room)
                let id = this.socketId.get(req.user.email)
                this.server.in(id).socketsJoin(Body.roomName)
                if (Body.email)
                {
                    for (const email of Body.email)
                    {
                        console.log(email)
                        id = this.socketId.get(email)
                        this.server.to(id).socketsJoin(email)
                        const newUser = await this.prisma.user.findUnique({where : {email : email}})
                        newRoom = await this.user.addUserToRoom(newUser, Body.roomName)
                    }
                }
            } else {
                const id = this.socketId.get(req.user.email)
                this.server.to(id).socketsJoin(Body.roomName)
                for (const email of Body.email)
                {
                    const newId = this.socketId.get(email)
                    this.server.to(newId).socketsJoin(Body.roomName)
                }
            }
            console.log(newRoom)
            client.emit("get_room", {'room' : newRoom})
        }
    }

    // joining the socket of user in  specific room
    @SubscribeMessage('joinRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async handleJoiningTheRoom(@ConnectedSocket() client : Socket , @Req() req, @MessageBody() body) {
        console.log(`client  ${client.id} connected and joining the room ${body.roomName}`)
        console.log(body)
        const user = await this.validateUserByEmail(req.user.email, body.roomName, 1)
        if (user)
        {
            const result = await this.user.joiningTheRoom(body);
            if (result == undefined)
                client.emit('onError' , {'message' : 'password incorrect'})
            this.server.in(client.id).socketsJoin(body.roomName)
            await this.user.addUserToRoom(user, body.roomName)
            for (const email of body.email)
            {
                const id = this.socketId.get(email)
                this.server.in(id).socketsJoin(body.roomName)
                const newUser = await this.prisma.user.findUnique({where : {email : email}})
                const newUpdateChat = await this.user.addUserToRoom(newUser, body.roomName)
            }
        }
        else
            client.emit('onError' , {'message' : 'you are baned'})
    }


    // leave the socket from room
    @SubscribeMessage('leaveRoom')
    @UseGuards(AuthGuard('websocket-jwt'))
    async leaveRoomHandler(@Req() req, @MessageBody() body) {
        console.log('body' , body)
        if (!body.kick && !body.ban)
            body.email.push(req.user.email)
        const user = await this.validateUserByUsername(req.user.username)
        if (user)
        {
            for (const email of body.email)
            {
                const Id = this.socketId.get(email)
                this.socketId.delete(email)
                this.server.in(Id).socketsLeave(body.roomName)
                const user = await this.validateUserByEmail(email, body.roomName, 0)
                if (body.ban)
                    await this.user.banUser(user , body.roomName, body.email)
                this.user.deleteUserFromRoom(user , body.roomName)
            }
        }
    }

    // if the user connect to the event
    async  handleConnection(client: Socket, ...args: any[]) {
        const payload = await this.jwt.verifyAsync(client.handshake.headers.authorization.slice(7))
        this.socketId.set(payload.email, client.id)
    }

    // if the user disconnect to the event
    async handleDisconnect(client: any) {
        const payload = await this.jwt.verifyAsync(client.handshake.headers.authorization.slice(7))
        this.socketId.delete(payload.email)
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
