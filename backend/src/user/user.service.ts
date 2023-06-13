import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { use } from 'passport';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    
    // create room {2 users => n users}
    async creatRoom(name , user) {
        const room = await this.getRoomByName(name)
        if (!room)
        {
            try {
                await this.addStatusOfUser(user, 'Admin')
                const room = await this.prismaService.chatRoom.create(
                    {
                        data : {
                            roomName : name,
                            timeCreate : new Date(Date.now()),
                            users : {
                                connect : { id : user.id}
                            },
                        }
                    }
                )
                return room
            }
            catch(error) {
                console.log(error)
            }
            finally { this.prismaService.$disconnect() }
        }
        return `room ${name} already exist`
    }

    // add user to specific room
    async addUserToRoom(user , name) {
        let room = await this.prismaService.chatRoom.findFirst({where : {roomName : name}})
        await this.addStatusOfUser(user , 'member')
        if (!await this.avoidDuplicate(user, name))
        {
            console.log('******')
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
    }

    // show all available rooms
    async getAllRooms() {
        return await this.prismaService.chatRoom.findMany({include : {users : true}})
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

    // set status of user
    async addStatusOfUser(user, status) {
        await this.prismaService.user.update({
            where : 
            {   
                email : user.email
            },
            data : 
            {
                status : status
            }
        })
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
}
