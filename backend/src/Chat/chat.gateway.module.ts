import { Module } from "@nestjs/common";
import { chatGateway } from "./chat.gateway";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";


@Module({
    imports : [ UserModule,PrismaModule],
    providers : [UserService, PrismaService, chatGateway]
})
export class chatModule{}