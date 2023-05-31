"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const config_1 = require("@nestjs/config");
const auth_strategy42_1 = require("./auth.strategy42");
const prisma_module_1 = require("../prisma/prisma.module");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let authModule = class authModule {
};
authModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({
                secret: process.env.SECRET,
                signOptions: {
                    expiresIn: '1w'
                }
            }), prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [auth_controller_1.authController],
        providers: [prisma_service_1.PrismaService, auth_strategy42_1.AuthStrategy, config_1.ConfigService, auth_service_1.authService]
    })
], authModule);
exports.authModule = authModule;
//# sourceMappingURL=auth.module.js.map