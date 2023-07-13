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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const websockets_1 = require("@nestjs/websockets");
const prisma_service_1 = require("../Prisma/prisma.service");
let NotificationService = class NotificationService {
    constructor(jwtService, prismaServie) {
        this.jwtService = jwtService;
        this.prismaServie = prismaServie;
        this.socketById = new Map();
    }
    handleDisconnect(client) {
        this.changeActivityStatusToOffline(client);
    }
    async changeActivityStatusToOffline(client) {
        const userObj = this.jwtService.verify(client.handshake.headers.authorization.slice(7));
        const user = await this.prismaServie.user.findFirst({
            where: {
                username: userObj.username
            }
        });
        this.prismaServie.user.update({
            where: {
                username: userObj.username,
            },
            data: {
                activitystatus: true,
            }
        });
        this.socketById.delete(user.id);
    }
    handleConnection(client) {
        this.pushClientInMap(client);
    }
    async getNotification(body, req) {
        const notifcation = await this.pushNotificationToDb(body, req);
        this.sendNotification(notifcation);
    }
    async sendNotification(notification) {
        var _a;
        const notif = await this.prismaServie.notification.findUnique({
            where: {
                id: notification.id
            },
            include: {
                senderAndReicever: true,
            }
        });
        notification.sender = notif.senderAndReicever[0];
        if (this.socketById.has((_a = notif.senderAndReicever[1]) === null || _a === void 0 ? void 0 : _a.id)) {
            for (let i = 0; i < this.socketById.get(notif.senderAndReicever[1].id).length; i++) {
                this.socketById.get(notif.senderAndReicever[1].id)[i].emit('receive_notification', notification);
            }
        }
    }
    async pushNotificationToDb(notificationBody, req) {
        const sender = await this.prismaServie.user.findUnique({
            where: {
                username: req.user.username,
            }
        });
        const reicever = await this.prismaServie.user.findUnique({
            where: {
                username: notificationBody.username
            }
        });
        let userIds = [sender.id, reicever.id];
        let notification = await this.prismaServie.notification.create({
            data: {
                description: notificationBody.description,
                title: notificationBody.title,
                senderAndReicever: {
                    connect: userIds.map((id) => ({ id })),
                },
            }
        });
        return notification;
    }
    async pushClientInMap(client) {
        try {
            const userObj = this.jwtService.verify(client.handshake.headers.authorization.slice(7));
            const user = await this.prismaServie.user.findFirst({
                where: {
                    username: userObj.username
                }
            });
            if (!this.socketById.has(user.id))
                this.socketById.set(user.id, [client]);
            else
                this.socketById.get(user.id).push(client);
            await this.prismaServie.user.update({
                where: {
                    username: userObj.username,
                },
                data: {
                    activitystatus: true,
                }
            });
        }
        catch (erro) {
            client.disconnect();
        }
    }
    async answerToNotification(body, req) {
        if (body.status == 'accepted') {
            let notification = await this.acceptNotificaion(body);
            this.deleteNotification(body);
            let acceptation = {
                title: notification.title,
                reicever: notification.senderAndReicever[1].username,
                status: 'accepted'
            };
            for (let i = 0; i < this.socketById.get(notification.senderAndReicever[1].id).length; i++) {
                this.socketById.get(notification.senderAndReicever[0].id)[i].emit('receive_notification', acceptation);
            }
        }
        else if (body.status == 'rejected')
            this.deleteNotification(body);
    }
    deleteNotification(messageBody) {
        try {
            this.prismaServie.notification.delete({
                where: {
                    id: messageBody.id,
                }
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async acceptNotificaion(messageBody) {
        try {
            let notification = await this.prismaServie.notification.findUnique({
                where: {
                    id: messageBody.id,
                },
                include: {
                    senderAndReicever: true
                }
            });
            await this.prismaServie.user.update({
                where: {
                    id: notification.senderAndReicever[0].id
                },
                data: {
                    friends: {
                        connect: {
                            id: notification.senderAndReicever[1].id
                        }
                    }
                }
            });
            await this.prismaServie.user.update({
                where: {
                    id: notification.senderAndReicever[1].id
                },
                data: {
                    friends: {
                        connect: {
                            id: notification.senderAndReicever[0].id
                        }
                    }
                }
            });
            return notification;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('websocket-jwt')),
    (0, websockets_1.SubscribeMessage)('send_notification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "getNotification", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('websocket-jwt')),
    (0, websockets_1.SubscribeMessage)('answer_notification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "answerToNotification", null);
NotificationService = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'notification', cors: true }),
    __metadata("design:paramtypes", [jwt_1.JwtService, prisma_service_1.PrismaService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map