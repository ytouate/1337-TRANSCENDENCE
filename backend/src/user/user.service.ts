import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}


  // create room {2 users => n users}
  async creatRoom(user, Body) {
    let { roomName, status, password } = Body;
    if (!password) password = '';
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (!room) {
      try {
        let hash = await bcrypt.hash(password, 10);
        let room = await this.prismaService.chatRoom.create({
          data: {
            roomName: roomName,
            timeCreate: new Date(Date.now()),
            users: {
              connect: { id: user.id },
            },
            status: status,
            password: hash,
            isDms: Body.isDm,
          },
          include: { users: true, messages: true },
        });
        await this.setAdmin({ email: [user.email], roomName: Body.roomName });
        return { found: false, room };
      } catch (error) {
      } finally {
        this.prismaService.$disconnect();
      }
    }
    // return {'exist': true, room};
    return { found: true, room };
  }


  // add user to specific room
  async addUserToRoom(user, name) {
    let newRoom: any;
    let room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: name },
    });
    if (!(await this.avoidDuplicate(user, name))) {
      newRoom = await this.prismaService.chatRoom.update({
        where: { id: room.id },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
        include: { users: true, messages: true },
      });
    }
    return newRoom;
  }



  // delete user from current room
  async deleteUserFromRoom(user, name) {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: name },
      include: { users: true },
    });
    try {
      const update = await this.prismaService.chatRoom.update({
        where: { id: room.id },
        data: {
          users: {
            disconnect: {
              id: user.id,
            },
          },
        },
        include: { users: true },
      });
      let neW: any;
      if (update.users.length == 0) {
        await this.prismaService.message.deleteMany({
          where: { roomId: update.id },
        });
        neW = await this.prismaService.chatRoom.delete({
          where: { id: update.id },
        });
      }
      console.log('nw', update.users);
      return update;
    } catch (error) {
      throw new UnauthorizedException({}, '');
    }
  }
  


  // show all available rooms
  async getAllRooms(req: any) {
    let rooms: any = await this.prismaService.chatRoom.findMany({
      where: { status: { in: ['public', 'protected'] } },
      include: { users: true, messages: true },
    });
   return rooms;
  }



  // get a specific room by name
  async getRoomByName(name) {
    const room = await this.prismaService.chatRoom.findFirst({
      where: {
        roomName: name,
      },
      include: {
        users: true,
        messages: {
          include: {
            user: true,
          },
        },
      },
    });
    if (room?.status == 'private') throw new UnauthorizedException({}, '');
    return room;
  }



  // check user is has already joined
  async avoidDuplicate(user, name) {
    const chatRoom = await this.prismaService.chatRoom.findFirst({
      where: {
        roomName: name,
      },
      include: { users: true },
    });
    return chatRoom.users.find((userId) => userId.id == user.id);
  }

  // add data in message table
  async addDataInMessageTable(data, id, user) {
    const dataTime = new Date();
    let date = ('0' + dataTime.getDate()).slice(-2);
    let month = ('0' + (dataTime.getMonth() + 1)).slice(-2);
    const time =
      dataTime.getFullYear() +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      ' ' +
      dataTime.getHours() +
      ':' +
      dataTime.getMinutes();
    const userFind = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    const message = await this.prismaService.message.create({
      data: {
        data: data,
        time: time,
        roomId: id,
        userId: userFind.id,
      },
    });
    return message;
  }




  //add data in Room { messages}
  async putDataInDatabase(name, data, req) {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: name },
    });
    let message: any = await this.addDataInMessageTable(
      data,
      room.id,
      req.user,
    );
    await this.prismaService.chatRoom.update({
      where: {
        id: room.id,
      },
      data: {
        messages: {
          connect: { id: message.id },
        },
      },
    });
    let sender = await this.prismaService.user.findUnique({
      where: { id: message.userId },
    });
    message.sender = sender;
    return message;
  }

  

  //check user  if have order to join the rrom
  async joiningTheRoom(param) {
    const { roomName, password } = param;
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (room.status === 'protected') {
      if (!(await bcrypt.compare(password, room.password))) return undefined;
    }
    if (room.status === 'private') return undefined;
    return true;
  }



  //get user with username
  async getUserWithUsername(name) {
    return await this.prismaService.user.findFirst({
      where: { username: name },
    });
  }



  // set admin to other users in my room
  async setAdmin(param) {
    // const member = await this.getUserWithUsername(param.username)
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: param.roomName },
    });
    // if (room?.admins.indexOf(member.email) < 0)
    // {
    return await this.prismaService.chatRoom.update({
      where: { id: room.id },
      data: {
        admins: { push: param.email },
      },
      include: { users: true, messages: true },
    });
    // }
    // return room
  }



  //change password of protected room
  async changePasswordOfProtectedRoom(param) {
    const { roomName, password } = param;
    console.log(param);
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    let hash = await bcrypt.hash(password, 10);
    if (room) {
      return await this.prismaService.chatRoom.update({
        where: {
          id: room.id,
        },
        data: {
          password: hash,
        },
      });
    }
    throw new NotFoundException({}, 'room not found');
  }



  // delete pass from protected room
  async deletePasswordOfProtectedRoom(param) {
    const { roomName } = param;
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (room) {
      return await this.prismaService.chatRoom.update({
        where: {
          id: room.id,
        },
        data: {
          status: 'public',
        },
      });
    }
    throw new NotFoundException({}, 'room not found');
  }



  // ban users
  async banUser(user, roomName, emails) {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (room.banUsers.indexOf(user.email) < 0) {
      return await this.prismaService.chatRoom.update({
        where: { id: room.id },
        data: {
          banUsers: {
            push: emails,
          },
        },
      });
    }
    console.log('ban ', room);
    return room;
  }



  // mute users
  async muteUsers(body) {
    const { email, roomName } = body;
    console.log('body : ', body);
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
    if (!room) throw new NotFoundException();
    // if (room.muteUsers.indexOf(member.email) < 0)
    // {
    return await this.prismaService.chatRoom.update({
      where: { id: room.id },
      data: {
        muteUsers: {
          push: email,
        },
      },
      include: { users: true, messages: true },
    });
    // }
  }



  // delet user from mute users
  async deleteUserFromMuteUsers(body) {
    const { email, roomName } = body;
    console.log('body : ', body);
    const room = await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });

    const emails = room.muteUsers.filter((userMail) => {
      if (email.find((mail) => mail == userMail)) return false;
      return true;
    });
    console.log('filtered mails: ', emails);
    if (!room) throw new NotFoundException();
    // if (room.muteUsers.indexOf(member.email) < 0)
    // {
    return await this.prismaService.chatRoom.update({
      where: { id: room.id },
      data: {
        muteUsers: emails,
      },
      include: { users: true, messages: true },
    });
    // }
  }



  // validate user to create chat
  async validateUserToCreateChat(req) {
    return await this.prismaService.user.findUnique({
      where: { email: req.user.email },
    });
  }

  
  // get admins of chatRoom
  async getAdminsOfUsers(roomName) {
    return await this.prismaService.chatRoom.findFirst({
      where: { roomName: roomName },
    });
  }
}
