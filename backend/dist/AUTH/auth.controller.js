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
const auth_strategy42_1 = require("./auth.strategy42");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
let authController = class authController {
    constructor(authservice, configservice, authstratrgy) {
        this.authservice = authservice;
        this.configservice = configservice;
        this.authstratrgy = authstratrgy;
    }
    getSucces() {
        return 'succesa a';
    }
    async getProfilee(res, req) {
        const user = await this.authservice.createUser(req.user);
        console.log("email" + user.email);
        console.log("user name" + user.username);
        const token = await this.authservice.signToken(user.email, user.username);
        console.log(token);
        res.cookie('Token', token);
        return user;
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    (0, common_2.Get)('success'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], authController.prototype, "getSucces", null);
__decorate([
    (0, common_2.Get)('sigin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], authController.prototype, "getProfilee", null);
authController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.authService,
        config_1.ConfigService,
        auth_strategy42_1.AuthStrategy])
], authController);
exports.authController = authController;
//# sourceMappingURL=auth.controller.js.map