import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/Prisma/prisma.service';
export declare class NotificationService {
    private jwtService;
    private prismaServie;
    socketByID: Map<number, Socket[]>;
    constructor(jwtService: JwtService, prismaServie: PrismaService);
    handleConnection(client: Socket): void;
    getNotification(body: any, req: any): Promise<void>;
    sendNotification(notification: any): Promise<void>;
    pushNotificationToDb(notificationBody: any, req: any): Promise<Notification>;
    pushClientInMap(client: Socket): Promise<void>;
    answerToNotification(body: any, req: any): Promise<void>;
    deleteNotification(messageBody: any): void;
    acceptNotificaion(messageBody: any): Promise<void>;
}
