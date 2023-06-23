import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { PrismaService } from "src/Prisma/prisma.service";
import { UserService } from "src/user/user.service";
export declare class chatGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    private user;
    constructor(prisma: PrismaService, user: UserService);
    server: Server;
    private socketId;
    onMessage(client: Socket, data: any, req: any): void;
    onModuleInit(): void;
    handle(client: Socket, req: any): Promise<string>;
    leaveRoomHandler(client: Socket, req: any): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: any): Promise<void>;
    validateUserByUsername(username: any): Promise<import(".prisma/client").User>;
    validateUserByEmail(email: any): Promise<import(".prisma/client").User>;
}
