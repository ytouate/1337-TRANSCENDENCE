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
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = class NotificationService {
    constructor(jwtService, prismaServie) {
        this.jwtService = jwtService;
        this.prismaServie = prismaServie;
        this.socketByID = new Map();
    }
    handleConnection(client) {
        this.pushClientInMap(client);
    }
    async getNotification(body, req) {
        const notifcation = await this.pushNotificationToDb(body, req);
        this.sendNotification(notifcation);
    }
    sendNotification(notification) {
        if (this.socketByID.has(notification.receiverId)) {
            for (let i = 0; i < this.socketByID.get(notification.receiverId).length; i++) {
                this.socketByID.get(notification.receiverId)[i].emit('receive_notification', notification);
            }
        }
    }
    async pushNotificationToDb(notificationBody, req) {
        const user = await this.prismaServie.user.findFirst({
            where: {
                username: notificationBody.username
            }
        });
        const notifcation = await this.prismaServie.notification.create({
            data: {
                description: notificationBody.description,
                sender: req.user.username,
                title: notificationBody.title,
                reicever: {
                    connect: { id: user.id }
                },
            }
        });
        return notifcation;
    }
    async pushClientInMap(client) {
        try {
            const userObj = this.jwtService.verify(client.handshake.headers.authorization.slice(7));
            const user = await this.prismaServie.user.findFirst({
                where: {
                    username: userObj.username
                }
            });
            if (!this.socketByID.has(user.id))
                this.socketByID.set(user.id, [client]);
            else
                this.socketByID.get(user.id).push(client);
        }
        catch (erro) {
            client.disconnect();
        }
    }
};
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationService.prototype, "handleConnection", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('websocket-jwt')),
    (0, websockets_1.SubscribeMessage)('send_notification'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "getNotification", null);
NotificationService = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, prisma_service_1.PrismaService])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map