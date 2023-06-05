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
    getSucces() {
        console.log('asjx');
        return { data: "lansds" };
    }
    async getProfilee(res, req) {
        console.log('her backend');
        const user = await this.authservice.createUser(req.user);
        const token = await this.authservice.signToken(user.username, user.email);
        await this.authservice.checkUserhave2fa(user);
        console.log(token);
        res.cookie('Token', token);
        res.redirect('http://localhost:5173');
    }
    getProfile(req) {
        console.log(req.headers.Token);
        return { name: 'Youssef' };
    }
    async siginWith2fa(request, req) {
        const user = await this.authservice.validateUser(request.headers.authorization);
        if (!user)
            return 'unvalide user';
        const num = await this.authservice.sigin2fa(this.authservice.generateCode(), req.email);
        await this.authservice.add2fa(user.email, req.email, num);
        return '';
    }
    async verificationCode(body) {
        if (this.code == body.code)
            return 'code s7i7';
        return 'code ghalate';
    }
};
__decorate([
    (0, common_2.Get)('success'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], authController.prototype, "getSucces", null);
__decorate([
    (0, common_2.Get)('signin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "getProfilee", null);
__decorate([
    (0, common_2.Get)('profil'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], authController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('2fa'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_DTO_1.authDto]),
    __metadata("design:returntype", Promise)
], authController.prototype, "siginWith2fa", null);
__decorate([
    (0, common_1.Post)('2fa/validateCode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "verificationCode", null);
authController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.authService])
], authController);
exports.authController = authController;
//# sourceMappingURL=auth.controller.js.map