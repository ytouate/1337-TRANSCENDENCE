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
exports.UserSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserSettingsService = class UserSettingsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async blockUser(source, target) {
        try {
            this.deleteUserFromFriend(source, target);
            this.addUserToBlocking(source, target);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async deleteUserFromFriend(source, target) {
        let userSource = await this.prismaService.user.findFirst({
            where: {
                email: source.email
            },
        });
        let userTarget = await this.prismaService.user.update({
            where: {
                username: target.username,
            },
            data: {
                friends: {
                    disconnect: {
                        id: userSource.id,
                    }
                }
            }
        });
        this.prismaService.user.update({
            where: {
                username: userSource.username,
            },
            data: {
                friends: {
                    disconnect: {
                        id: userTarget.id,
                    }
                }
            }
        });
        return userTarget;
    }
    async addUserToBlocking(source, target) {
        this.prismaService.user.update({
            where: {
                email: source.email,
            },
            data: {
                blocked: {
                    connect: {
                        username: target.username
                    }
                }
            }
        });
    }
    async searchUser(user, pattern) {
        let sourceUser = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            },
            include: {
                friends: true,
                blocked: true,
                blockedBy: true,
            }
        });
        let usersSearch = await this.prismaService.user.findMany({
            where: {
                username: {
                    contains: pattern,
                }
            }
        });
        usersSearch.map((obj) => {
            obj.friendStatus = this.checkUserStatus(sourceUser, obj);
        });
        console.log(usersSearch);
        return usersSearch;
    }
    checkUserStatus(user, targetUser) {
        if (user.blocked.find(obj => obj.email === targetUser.email))
            return 'blocked';
        else if (user.blockedBy.find(obj => obj.email === targetUser.email))
            return 'blockedBy';
        else if (user.friends.find(obj => obj.email === targetUser.email))
            return 'friend';
        else
            return 'notFriend';
    }
    async unblockUser(source, target) {
        this.prismaService.user.update({
            where: {
                email: source.email,
            },
            data: {
                blocked: {
                    disconnect: {
                        username: target.username
                    }
                }
            }
        });
    }
    async getUser(user, id) {
        let sourceUser = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            },
            include: {
                friends: true,
                blocked: true,
                blockedBy: true,
            }
        });
        let userToReturn = await this.prismaService.user.findUnique({
            where: {
                id: id
            },
        });
        if (userToReturn) {
            userToReturn.friendStatus = this.checkUserStatus(sourceUser, userToReturn);
            return userToReturn;
        }
        return {
            status: 404,
            message: 'user not found'
        };
    }
    async getUserByUsername(name) {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: name,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('user not found');
        return user;
    }
    async getUserById(userId) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                preference: true,
            },
        });
        const gamesPlayed = await this.prismaService.game.count({
            where: {
                players: {
                    some: {
                        id: user.id,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('user not found');
        return Object.assign(Object.assign({}, user), { gamesPlayed });
    }
    async updateUserWin(userId) {
        try {
            await this.prismaService.user.update({
                where: {
                    id: userId,
                },
                data: {
                    win: { increment: 1 },
                },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async updateUserLoss(userId) {
        try {
            await this.prismaService.user.update({
                where: {
                    id: userId,
                },
                data: {
                    loss: { increment: 1 },
                },
            });
        }
        catch (error) {
            throw error;
        }
    }
};
UserSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserSettingsService);
exports.UserSettingsService = UserSettingsService;
//# sourceMappingURL=user.service.js.map