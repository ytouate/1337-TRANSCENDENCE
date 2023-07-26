import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { userReturn, userReturnToGatway } from 'src/utils/user.return';
import { timeout } from 'rxjs';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    
    // create room {2 users => n users}
    async creatRoom(Param , user, isDm) {
        let {roomName  , status, password} = Param
        if (!password)
            password = ''
        const room = await this.prismaService.chatRoom.findFirst({ where : {roomName : roomName}})
        if (!room)
        {
            try {
                let hash = await bcrypt.hash(password, 10)
                let room = await this.prismaService.chatRoom.create(
                    {
                        data : {
                            roomName : roomName,
                            timeCreate : new Date(Date.now()),
                            users : {
                                connect : { id : user.id}
                            },
                            status : status,
                            password : hash,
                            isDms : isDm,
                        }, include : {users : true ,messages : true}
                    }
                    )
                await this.setAdmin({'username' : user.username , 'roomName' : roomName})
                console.log('room ' , room)
                return {'found': false, room};
            }
            catch(error) {
            }
            finally { this.prismaService.$disconnect() }
        }
        // return {'exist': true, room};
        return {'found': true, room};
    }

    // add user to specific room
    async addUserToRoom(user , name) {
        let room = await this.prismaService.chatRoom.findFirst({where : {roomName : name}})
        if (!await this.avoidDuplicate(user, name))
        {
            return await this.prismaService.chatRoom.update({
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
        return room
    }

    // delete user from current room
    async deleteUserFromRoom(user, name) {
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : name} , include : {users : true}})
        try {
            const update = await this.prismaService.chatRoom.update({
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
            return update
        }
        catch(error) { throw new UnauthorizedException({}, ''); }
    }

    // show all available rooms
    async getAllRooms() {
        return await this.prismaService.chatRoom.findMany({where : {status : { in : ['public', 'protected'] } } , include : {users : true , messages : true } })
    }

    // get a specific room by name
    async getRoomByName(name) {
        const room = await this.prismaService.chatRoom.findFirst(
            {
                where : 
                { 
                    roomName : name,
                },
                include :
                {
                    users : true,
                    messages :{
                        include: {
                            user : true,
                        }
                    }
                }
            }
        )
        if (room?.status == 'private')
            throw new UnauthorizedException({}, '');
        return room
    }


    // check user is has already joined
    async avoidDuplicate(user, name){
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
        const dataTime = new Date()
        let date = ("0" + dataTime.getDate()).slice(-2);
        let month = ("0" + (dataTime.getMonth() + 1)).slice(-2);
        const time = dataTime.getFullYear()+"-"+month+"-"+date+" "+" "+dataTime.getHours()+":"+dataTime.getMinutes()
        const userFind = await this.prismaService.user.findUnique({where : {email : user.email}})
        const message = await this.prismaService.message.create({
            data : {
                data : data,
                time : time,
                roomId : id,
                userId : userFind.id,
            }
        })
        return message
    }


    //add data in Room { messages}
    async   putDataInDatabase(name, data, req) {
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : name}})
        let message : any = await this.addDataInMessageTable(data, room.id, req.user)
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
        let sender = await this.prismaService.user.findUnique({where : {id : message.userId}})
        message.sender = sender
        return message
    }

    //check user  if have order to join the rrom
    async   joiningTheRoom(param)
    {
        const {roomName , password} = param
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        if (room.status === 'protected')
        {
            if (!await bcrypt.compare(password, room.password))
                return undefined       
        }
        if (room.status === 'private')
            return false
        return true 
    }  


    //get user with username
    async getUserWithUsername(name) {
        return await this.prismaService.user.findFirst({where : {username :  name}})
    }


    // set admin to other users in my room
    async   setAdmin(param) {
        const member = await this.getUserWithUsername(param.username)
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : param.roomName}})
        if (room?.admins.indexOf(member.email) < 0)
        {
            return await this.prismaService.chatRoom.update(
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
            return await this.prismaService.chatRoom.update(
            {
                where :
                {
                    id : room.id
                },
                data : 
                {
                    password : hash
                }
            })
        }
        throw new NotFoundException({}, 'room not found');
    }

    async   deletePasswordOfProtectedRoom(param) {
        const {roomName} = param
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        if (room){
            return await this.prismaService.chatRoom.update(
            {
                where :
                {
                    id : room.id
                },
                data : 
                {
                    status : 'public'
                }
            })
        }
        throw new NotFoundException({}, 'room not found');
    }

    // ban users
    async   banUser(param) {
        const {username , roomName} = param
        const member = await this.getUserWithUsername(username)
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        if (room.banUsers.indexOf(member.email) < 0)
        {
            return await this.prismaService.chatRoom.update(
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
        const member = await this.getUserWithUsername(username)
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        if (room.muteUsers.indexOf(member.email) < 0)
        {
            return await this.prismaService.chatRoom.update(
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
        @Tim
        return room
    }

    async   deleteMuteUser(param) {
        const {username , roomName} = param
        const member = await this.getUserWithUsername(username)
        const room = await this.prismaService.chatRoom.findFirst({where : {roomName : roomName}})
        if (room.muteUsers.indexOf(member.email) < 0)
        {
            return await this.prismaService.chatRoom.update(
                {
                    where : {id : room.id} , 
                    data : 
                    {
                        muteUsers : 
                        {
                            
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
        return await this.prismaService.chatRoom.findFirst({where : {roomName : roomName} })
    }
}
