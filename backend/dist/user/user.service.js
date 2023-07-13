"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async creatRoom(Param, user) {
        let { roomName, password } = Param;
        if (!password)
            password = '';
        const room = await this.getRoomByName(roomName);
        if (!room) {
            try {
                await this.setAdmin({ 'username': user.username, 'roomName': roomName });
                await this.prismaService.chatRoom.create({
                    data: {
                        roomName: roomName,
                        timeCreate: new Date(Date.now()),
                        users: {
                            connect: { id: user.id }
                        },
                        password: password
                    }
                });
                return { 'message': `room ${roomName} already exist` };
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.prismaService.$disconnect();
            }
        }
        return { 'message': `room ${roomName} already exist` };
    }
    async addUserToRoom(user, name) {
        let room = await this.prismaService.chatRoom.findFirst({ where: { roomName: name } });
        if (!await this.avoidDuplicate(user, name)) {
            await this.prismaService.chatRoom.update({
                where: { id: room.id },
                data: {
                    users: {
                        connect: {
                            id: user.id
                        },
                    }
                }
            });
        }
    }
    async deleteUserFromRoom(user, name) {
        const room = await this.prismaService.chatRoom.findFirst({ where: { roomName: name }, include: { users: true } });
        try {
            await this.prismaService.chatRoom.update({
                where: { id: room.id },
                data: {
                    users: {
                        disconnect: {
                            id: user.id
                        }
                    }
                }
            });
            return { 'message': `user has deleted from ${name}` };
        }
        catch (error) {
            return { 'message': error };
        }
    }
    async getAllRooms() {
        return await this.prismaService.chatRoom.findMany({ include: { users: true, messages: true } });
    }
    async getRoomByName(name) {
        return await this.prismaService.chatRoom.findFirst({
            where: {
                roomName: name
            },
            include: {
                users: true,
                messages: { include: { user: true } },
            }
        });
    }
    async avoidDuplicate(user, name) {
        const chatRoom = await this.prismaService.chatRoom.findFirst({
            where: {
                roomName: name
            },
            include: { users: true }
        });
        return chatRoom.users.find(userId => userId.id == user.id);
    }
    async addDataInMessageTable(data, id, user) {
        const userFind = await this.prismaService.user.findUnique({ where: { email: user.email } });
        console.log(data);
        const message = await this.prismaService.message.create({
            data: {
                data: data,
                time: new Date(Date.now()),
                roomId: id,
                userId: userFind.id,
            }
        });
        return message;
    }
    async putDataInDatabase(name, data, user) {
        const room = await this.prismaService.chatRoom.findFirst({ where: { roomName: name } });
        const message = await this.addDataInMessageTable(data, room.id, user);
        await this.prismaService.chatRoom.update({
            where: {
                id: room.id
            },
            data: {
                messages: {
                    connect: { id: message.id }
                }
            }
        });
    }
    async joiningTheRoom(param, user) {
        const { roomName, password } = param;
        const room = await this.getRoomByName(roomName);
        console.log(room.status);
        if (room.status === 'protected') {
            if (password != room.password)
                return undefined;
        }
        return true;
    }
    async getUserWithUsername(name) {
        return await this.prismaService.user.findFirst({ where: { username: name } });
    }
    async setAdmin(param) {
        const member = await this.prismaService.user.findFirst({ where: { username: param.username } });
        const room = await this.prismaService.chatRoom.findFirst({ where: { roomName: param.roomName } });
        if (room.admins.indexOf(member.email) < 0) {
            await this.prismaService.chatRoom.update({
                where: { id: room.id },
                data: {
                    admins: { push: member.email }
                }
            });
        }
        return room;
    }
    async changePasswordOfProtectedRoom(param) {
        const { roomName, password } = param;
        const room = await this.prismaService.chatRoom.findFirst({ where: { roomName: roomName } });
        if (room) {
            await this.prismaService.chatRoom.update({ where: {
                    id: room.id
                },
                data: { password: password }
            });
        }
    }
    async banUser(param) {
        const { username, roomName } = param;
        const member = await this.prismaService.user.findFirst({ where: { username: username } });
        const room = await this.prismaService.chatRoom.findFirst({ where: { roomName: roomName } });
        if (room.banUsers.indexOf(member.email) < 0) {
            await this.prismaService.chatRoom.update({
                where: { id: room.id },
                data: {
                    banUsers: {
                        push: member.email
                    }
                }
            });
        }
        return room;
    }
    async muteUsers(param) {
        const { username, roomName } = param;
        const member = await this.prismaService.user.findFirst({ where: { username: username } });
        const room = await this.prismaService.chatRoom.findFirst({ where: { roomName: roomName } });
        if (room.muteUsers.indexOf(member.email) < 0) {
            await this.prismaService.chatRoom.update({
                where: { id: room.id },
                data: {
                    muteUsers: {
                        push: member.email
                    }
                }
            });
        }
        return room;
    }
    async validateUserToCreateChat(req) {
        return await this.prismaService.user.findUnique({ where: { email: req.user.email } });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map