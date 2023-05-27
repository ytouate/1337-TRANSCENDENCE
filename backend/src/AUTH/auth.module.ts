import { Module } from "@nestjs/common";
import { authService } from "./auth.service";
import { authController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthStrategy } from "./auth.strategy42";
import { PrismaClient } from "@prisma/client";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    imports : [PrismaModule, ConfigModule],
    controllers : [authController],
    providers : [PrismaService, AuthStrategy, ConfigService, authService]
})
export class authModule {}