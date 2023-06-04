import { Module } from '@nestjs/common';
import { authModule } from './AUTH/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [ProfileModule, MailerModule , ConfigModule.forRoot({ isGlobal: true }) , authModule, PrismaModule, UserModule, NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
