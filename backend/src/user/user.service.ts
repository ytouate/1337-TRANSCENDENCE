import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    
    // create room {2 users => n users}
    async creatRoom(Param , user) {
        let {roomName  , status, password} = Param
        if (!password)
            password = ''
        const room = await this.getRoomByName(roomName)
        if (!room)
        {
            try {
                let hash = await bcrypt.hash(password, 10)
                console.log(hash)
                await this.prismaService.chatRoom.create(
                    {
                        data : {
                            roomName : roomName,
                            timeCreate : new Date(Date.now()),
                            users : {
                                connect : { id : user.id}
                            },
                            status : status,
                            password : hash
                        }
                    }
                    )
                await this.setAdmin({'username' : user.username , 'roomName' : roomName})
                return {'message' : `room ${roomName} has created`}
            }
            catch(error) {
                console.log(error)
            }
            finally { this.prismaService.$disconnect() }
        }
        return {'message' : `room ${roomName} already exist`}
    }

    // add user to specific room
    async addUserToRoom(user , name) {
        let room = await this.prismaService.chatRoom.findFirst({where : {roomName : name}})
        if (!await this.avoidDuplicate(user, name))
        {
            await this.prismaService.chatRoom.update({
                where : { id : room.id},
                data :
                { 
                    users : 
                    {
                        connect : 
                        { 
                            id : user.id 
                        },
                    } 
                }
            })
        }
    }

    // delete user from current room
    async deleteUserFromRoom(user, name) {
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : name} , include : {users : true}})
        try {
            await this.prismaService.chatRoom.update({
                where : {id : room.id},
                data : {
                    users :
                    {
                        disconnect : 
                        {
                            id : user.id
                        }
                    }
                }
            })
            return {'message' : `user has deleted from ${name}`}
        }
        catch(error) { return {'message' : error} }
    }

    // show all available rooms
    async getAllRooms() {
        return await this.prismaService.chatRoom.findMany({include : {users : true , messages : true}})
    }

    // get a specific room by name
    async getRoomByName(name) {
        return await this.prismaService.chatRoom.findFirst(
            {
                where : 
                { 
                    roomName : name
                },
                include :
                {
                    users : true,
                    messages : { include : { user : true} },
                }
            }
        )
    }


    // check user is has already joined
    async   avoidDuplicate(user, name){
        const chatRoom = await this.prismaService.chatRoom.findFirst({
            where : 
            {
                roomName : name
            },
            include : {users : true}
        })
        return chatRoom.users.find(userId => userId.id == user.id)
    }

    // add data in message table
    async   addDataInMessageTable(data , id, user) {
        const userFind = await this.prismaService.user.findUnique({where : {email : user.email}})
        console.log(data)
        const message = await this.prismaService.message.create({
            data : {
                data : data,
                time : new Date(Date.now()),
                roomId : id,
                userId : userFind.id,
            }
        })
        return message
    }


    //add data in Room { messages}
    async   putDataInDatabase(name, data, user) {
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : name}})
        const message = await this.addDataInMessageTable(data, room.id, user)
        await this.prismaService.chatRoom.update({
            where : 
            {
                id : room.id
            },
            data : 
            {
                messages : 
                {
                    connect : { id : message.id }
                }
            }
        })
    }


    //check user  if have order to join the rrom
    async   joiningTheRoom(param, user)
    {
        const {roomName , password} = param
        const room = await this.getRoomByName(roomName)
        if (room.status === 'protected')
        {
            if (password !== room.password)
                return undefined       
        }
        return true 
    }  


    //get user with username
    async getUserWithUsername(name) {
        return await this.prismaService.user.findFirst({where : {username :  name}})
    }


    // set admin to other users in my room
    async   setAdmin(param) {
        const member = await this.prismaService.user.findFirst({where : {username : param.username}})
        const room = await this.prismaService.chatRoom.findFirst({ where : {roomName : param.roomName} })
        if (room.admins.indexOf(member.email) < 0)
        {
            await this.prismaService.chatRoom.update(
            {
                where : {id : room.id} , 
                data : {
                    admins : {push : member.email}
                }
            }    
            )
        }
        return room
    }


    //change password of protected room
    async   changePasswordOfProtectedRoom(param) {
        const {roomName, password} = param
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        let hash = await bcrypt.hash(password, 10)
        if (room){
            await this.prismaService.chatRoom.update({where : {
                id : room.id
            },
            data : { password : hash }
        })
        }
    }
a

    // ban users
    async   banUser(param) {
        const {username , roomName} = param
        const member = await this.prismaService.user.findFirst({where : {username : username}})
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        if (room.banUsers.indexOf(member.email) < 0)
        {
            await this.prismaService.chatRoom.update(
                {
                    where : {id : room.id} , 
                    data : 
                    {
                        banUsers : 
                        {
                            push : member.email
                        }
                    }
                }
            )
        }
        return room
    }

    // mute users
    async   muteUsers(param) {
        const {username , roomName} = param
        const member = await this.prismaService.user.findFirst({where : {username : username}})
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        if (room.muteUsers.indexOf(member.email) < 0)
        {
            await this.prismaService.chatRoom.update(
                {
                    where : {id : room.id} , 
                    data : 
                    {
                        muteUsers : 
                        {
                            push : member.email
                        }
                    }
                }
            )
        }
        return room
    }

    // validate user to create chat
    async   validateUserToCreateChat(req)
    {
        return await this.prismaService.user.findUnique({where : {email : req.user.email}})
    }

    // get admins of chatRoom
    async   getAdminsOfUsers(roomName)
    {
        return await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
    }
}