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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/Prisma/prisma.service");
let UserService = class UserService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async creatRoom(Param, user) {
        let { roomName, status, password } = Param;
        if (!password)
            password = '';
        const room = await this.getRoomByName(roomName);
        if (!room) {
            try {
                await this.addStatusOfUser(user, 'Admin');
                const room = await this.prismaService.chatRoom.create({
                    data: {
                        roomName: roomName,
                        timeCreate: new Date(Date.now()),
                        users: {
                            connect: { id: user.id }
                        },
                        status: status,
                        password: password
                    }
                });
                return room;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.prismaService.$disconnect();
            }
        }
        return `room ${roomName} already exist`;
    }
    async addUserToRoom(user, name) {
        let room = await this.prismaService.chatRoom.findFirst({ where: { roomName: name } });
        await this.addStatusOfUser(user, 'member');
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
    }
    async getAllRooms() {
        return await this.prismaService.chatRoom.findMany({ include: { users: true } });
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
    async addStatusOfUser(user, status) {
        await this.prismaService.user.update({
            where: {
                email: user.email
            },
            data: {
                status: status
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
        return 'public';
    }
    async getUserWithUsername(name) {
        return await this.prismaService.user.findFirst({ where: { username: name } });
    }
    async setAdmin(param) {
        const member = await this.prismaService.user.findFirst({ where: { username: param.username } });
        const room = await this.prismaService.chatRoom.findFirst({ where: { roomName: param.roomName } });
        console.log(member);
        console.log(room);
        if (room) {
            await this.prismaService.chatRoom.update({
                where: { id: room.id },
                data: {
                    users: {
                        update: {
                            where: {
                                email: member.email
                            },
                            data: {
                                status: param.status
                            }
                        }
                    }
                }
            });
        }
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
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map