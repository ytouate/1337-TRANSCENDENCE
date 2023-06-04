import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { webSocketJwtStrategy } from 'src/strategies/websocket-jwt.strategie';

@Module({
  providers: [NotificationService, webSocketJwtStrategy, PrismaService]
})
export class NotificationModule {}
