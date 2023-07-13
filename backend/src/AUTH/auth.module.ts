import { Module } from "@nestjs/common";
import { authService } from "./auth.service";
import { authController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { AuthStrategy } from "./auth.strategy42";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "@nestjs-modules/mailer";


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