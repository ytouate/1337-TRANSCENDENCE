import { Module } from "@nestjs/common";
import { authService } from "./auth.service";
import { authController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthStrategy } from "./auth.strategy42";
import { PrismaClient } from "@prisma/client";
import { PrismaModule } from "src/Prisma/prisma.module";
import { PrismaService } from "src/Prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import Handlebars from "handlebars";
import { join } from "path";


@Module({
    imports : [MailerModule.forRoot({
        transport : {
            host: 'smtp.gmail.com',
            port: 465,
            ignoreTLS: true,
            secure: true,
            service : 'Gmail',
            auth : {
                user : 'othmanmallah13@gmail.com',
                pass : 'osmxubhgeixhaowp'
            }
        }, 
    }) ,JwtModule.register({
        global : true,
        secret : process.env.SECRET,
        signOptions : {
            expiresIn : '1w'
        }
    }) , PrismaModule, ConfigModule],
    controllers : [authController],
    providers : [ AuthStrategy, authService]
})
export class authModule {}