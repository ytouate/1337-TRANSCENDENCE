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
    async onMessage(client : Socket , @MessageBody() data , @Req() req)
    {
        const message = await this.user.putDataInDatabase(data.roomName, data.data, req)
        message.sender = userReturnToGatway(message.sender, req);
        console.log('backend romname' , data.roomName)
        this.server.to(data.roomName).emit('onMessage', message)
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
        const User = await this.validateUserByEmail(req.user.email, Body.roomName, 0)
        if (User)
        {
            const {roomName , status, password} = Body
            let {found, room} = await this.user.creatRoom({
                'roomName' : roomName ,
                'status'   : status ,
                'password' : password} , User)
            room = await this.prisma.chatRoom.findUnique({where : {id : room.id} , include : {messages : true , users : true}})
            if (!found)
            {
                let id = this.socketId.get(req.user.email)
                this.server.in(id).socketsJoin(Body.roomName)
                console.log(req.user.email , ': ' , client.id , ' join room' , Body.roomName)
                if (Body.email)
                {
                    for (const email of Body.email)
                    {
                        id = this.socketId.get(email)
                        this.server.to(id).socketsJoin(email)
                        console.log(email , ': ' , id , ' join room' , Body.roomName)
                        const newUser = await this.prisma.user.findUnique({where : {email : email}})
                        room = await this.user.addUserToRoom(newUser, Body.roomName)
                    }
                }
            } else {
                const id = this.socketId.get(req.user.email)
                this.server.to(id).socketsJoin(roomName)
                console.log('body' , Body.email)
                for (const email of Body.email)
                {
                    const newId = this.socketId.get(email)
                    console.log('newID' , newId);
                    this.server.to(newId).socketsJoin(roomName)
                }
            }
            client.emit("get_room", {'room' : room})
            // this.server.to(roomName).emit("get_room", {'room': room});
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
