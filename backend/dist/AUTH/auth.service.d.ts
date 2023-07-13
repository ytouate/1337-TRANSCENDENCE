import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
export declare class authService {
    private prisma;
    private configservice;
    private jwt;
    private mail;
    constructor(prisma: PrismaService, configservice: ConfigService, jwt: JwtService, mail: MailerService);
    createUser(newData: any): Promise<import(".prisma/client").User>;
    signToken(username: any, email: any): Promise<string>;
    add2fa(firstMail: any, email: any, code: any): Promise<void>;
    validateUser(req: any): Promise<any>;
    sigin2fa(code: any, email: any): Promise<any>;
    generateCode(): number;
    checkUserhave2fa(user: any): Promise<void>;
}
