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
const prisma_module_1 = require("../Prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
let authModule = class authModule {
};
authModule = __decorate([
    (0, common_1.Module)({
        imports: [mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    ignoreTLS: true,
                    secure: true,
                    service: 'Gmail',
                    auth: {
                        user: 'othmanmallah13@gmail.com',
                        pass: 'osmxubhgeixhaowp'
                    }
                },
            }), jwt_1.JwtModule.register({
                global: true,
                secret: process.env.SECRET,
                signOptions: {
                    expiresIn: '1w'
                }
            }), prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [auth_controller_1.authController],
        providers: [auth_strategy42_1.AuthStrategy, auth_service_1.authService]
    })
], authModule);
exports.authModule = authModule;
//# sourceMappingURL=auth.module.js.map