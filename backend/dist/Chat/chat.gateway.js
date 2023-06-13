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
exports.chatGateway = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../Prisma/prisma.service");
const user_service_1 = require("../user/user.service");
const common_2 = require("@nestjs/common");
let chatGateway = class chatGateway {
    constructor(prisma, user) {
        this.prisma = prisma;
        this.user = user;
    }
    onMessage(client, data, req) {
        this.server.in(client.handshake.query.roomName).emit('onMessage', data);
        this.user.putDataInDatabase(client.handshake.query.roomName, data, req.user);
    }
    onModuleInit() {
    }
    async handle(client, req) {
        console.log(`client  ${client.id} connected and joining the room ${client.handshake.query.roomName}`);
        const user = await this.updateUser(req.user, client);
        if (user) {
            this.server.in(user.socketId).socketsJoin(client.handshake.query.roomName);
            this.user.addUserToRoom(user, client.handshake.query.roomName);
        }
    }
    async leaveRoomHandler(client, req) {
        console.log(`client  ${client.id}  leave room ${client.handshake.query.roomName}`);
        const user = await this.validateUser(req.user);
        if (user) {
            this.server.in(client.id).socketsLeave(client.handshake.query.roomName);
            this.user.deleteUserFromRoom(user, client.handshake.query.roomName);
        }
    }
    async updateUser(user, client) {
        return await this.prisma.user.update({
            where: { email: user.email },
            data: { socketId: client.id }
        });
    }
    async handleConnection(client, ...args) {
        console.log(`client ${client.id} has connected`);
    }
    async handleDisconnect(client) {
        console.log(`client ${client.id} has disconnect`);
    }
    async validateUser(req) {
        return await this.prisma.user.findUnique({ where: { email: req.email } });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], chatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('websocket-jwt')),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __param(2, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object, Object]),
    __metadata("design:returntype", void 0)
], chatGateway.prototype, "onMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('websocket-jwt')),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], chatGateway.prototype, "handle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('websocket-jwt')),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], chatGateway.prototype, "leaveRoomHandler", null);
chatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'chat', cors: true }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService])
], chatGateway);
exports.chatGateway = chatGateway;
//# sourceMappingURL=chat.gateway.js.map