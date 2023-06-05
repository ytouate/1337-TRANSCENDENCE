import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class NotificationService {
    private jwtService;
    private prismaServie;
    socketByID: Map<number, Socket>;
    constructor(jwtService: JwtService, prismaServie: PrismaService);
    handleConnection(client: Socket): void;
    getNotification(body: any, req: any): Promise<void>;
    sendNotification(notification: any): void;
    pushNotificationToDb(notificationBody: any, req: any): Promise<import(".prisma/client").Notification>;
    pushClientInMap(client: Socket): Promise<void>;
}
