import { Module } from "@nestjs/common";
import { authService } from "./auth.service";
import { authController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthStrategy } from "./auth.strategy42";
import { PrismaClient } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports : [JwtModule.register({
        secret : process.env.SECRET,
        signOptions : {
            expiresIn : '1w'
        }
    }) , PrismaModule, ConfigModule],
    controllers : [authController],
    providers : [PrismaService, AuthStrategy, ConfigService, authService]
})
export class authModule {}