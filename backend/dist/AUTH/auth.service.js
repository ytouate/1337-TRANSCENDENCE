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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("src/Prisma/prisma.service");
const auth_strategy42_1 = require("./auth.strategy42");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
let authService = class authService {
    constructor(prisma, configservice, jwt, mail) {
        this.prisma = prisma;
        this.configservice = configservice;
        this.jwt = jwt;
        this.mail = mail;
    }
    async createUser(newData) {
        const user = await this.prisma.user.findUnique({ where: { email: newData.email } });
        if (!user) {
            console.log('craete new user');
            let newUser = await this.prisma.user.create({
                data: {
                    email: newData.email,
                    username: newData.username,
                    urlImage: auth_strategy42_1.imageLink,
                }
            });
            const payload = {
                email: newData.email,
                username: newData.username
            };
            return newUser;
        }
        return user;
    }
    async signToken(username, email) {
        const payload = {
            username: username,
            email: email
        };
        return await this.jwt.signAsync(payload);
    }
    async add2fa(firstMail, email, code) {
        const user = await this.prisma.user.updateMany({
            where: { email: firstMail },
            data: { optionalMail: email, codeVerification: code }
        });
    }
    async validateUser(data) {
        return await this.prisma.user.findUnique({ where: { email: data.email } });
    }
    async sigin2fa(code, email) {
        const mail = await this.mail.sendMail({
            from: 'othmanmallah13@gmail.com',
            to: email,
            subject: 'DKOORA Game',
            template: 'confirme',
            context: {
                code: code,
            },
            html: `<h1> code : ${code} </h1>`
        });
        return code;
    }
    generateCode() {
        return Math.floor(1000 + Math.random() * 90000);
    }
    async checkUserhave2fa(user) {
        if (user.optionalMail) {
            const code = await this.sigin2fa(this.generateCode(), user.optionalMail);
            this.add2fa(user.email, user.optionalMail, code);
        }
    }
};
authService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, config_1.ConfigService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], authService);
exports.authService = authService;
//# sourceMappingURL=auth.service.js.map