import { Module } from '@nestjs/common';
import { authModule } from './AUTH/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './Prisma/prisma.module';
import { ProfileModule } from './Profile/profile.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { chatModule } from './Chat/chat.gateway.module';
import { chatGateway } from './Chat/chat.gateway';
import { appController } from './app.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [UserModule ,chatModule ,NotificationModule,  ProfileModule, MailerModule , ConfigModule.forRoot({ isGlobal: true }) , authModule, PrismaModule, UserModule, NotificationModule],
  controllers: [appController],
  providers: [UserService,appController, chatGateway],
})
export class AppModule {}
