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
    onMessage(client: Socket, data: any, req: any): void;
    onModuleInit(): void;
    handle(client: Socket, req: any): Promise<void>;
    leaveRoomHandler(client: Socket, req: any): Promise<void>;
    updateUser(user: any, client: any): Promise<import(".prisma/client").User>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: any): Promise<void>;
    validateUser(req: any): Promise<import(".prisma/client").User>;
}
