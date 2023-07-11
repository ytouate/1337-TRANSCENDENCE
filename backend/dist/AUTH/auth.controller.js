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
exports.authController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const common_2 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_DTO_1 = require("./DTO/auth.DTO");
let authController = class authController {
    constructor(authservice) {
        this.authservice = authservice;
    }
    gett() { }
    async getProfilee(res, req) {
        console.log('her backend');
        const user = await this.authservice.createUser(req.user);
        const token = await this.authservice.signToken(user.username, user.email);
        await this.authservice.checkUserhave2fa(user);
        res.cookie('Token', token, { httpOnly: false });
        res.redirect('http://localhost:5173');
    }
    async getp(req) {
        const user = await this.authservice.validateUser(req.user, req);
        if (user)
            return user;
        return { error: 'user not found', status: 404 };
    }
    async siginWith2fa(request, body) {
        const user = await this.authservice.validateUser(request.user, request);
        if (!user)
            return 'unvalide user';
        await this.authservice.add2fa(user.email, body.email, 0);
        return { status: 201, message: '2fa activated succefully' };
    }
    async verificationCode(body, req) {
        if (this.code == body.code)
            return await this.authservice.validateUser(req.user, req);
        return 'code ghalate';
    }
    async logout(req) {
        console.log(req.headers.authorization);
        return 'delete JWT token from client';
    }
};
__decorate([
    (0, common_2.Get)('login'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], authController.prototype, "gett", null);
__decorate([
    (0, common_2.Get)('/redirect/signin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "getProfilee", null);
__decorate([
    (0, common_2.Get)('user'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "getp", null);
__decorate([
    (0, common_1.Post)('2fa'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_DTO_1.authDto]),
    __metadata("design:returntype", Promise)
], authController.prototype, "siginWith2fa", null);
__decorate([
    (0, common_1.Post)('2fa/validateCode'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "verificationCode", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "logout", null);
authController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.authService])
], authController);
exports.authController = authController;
//# sourceMappingURL=auth.controller.js.map