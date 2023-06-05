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
const websockets_1 = require("@nestjs/websockets");
let chatGateway = class chatGateway {
    newMessage(message, id) {
        console.log('From newMessage events');
        console.log('id :', id, 'message recieve :', message);
    }
    newMessagefromEvents(message, id) {
        console.log('From newEventsMessage events');
        console.log('id :', id, 'message recieve :', message);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('newMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.MessageBody)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], chatGateway.prototype, "newMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newEventsMessange'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.MessageBody)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], chatGateway.prototype, "newMessagefromEvents", null);
chatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*'
        }
    })
], chatGateway);
exports.chatGateway = chatGateway;
//# sourceMappingURL=chat.gateway.js.map