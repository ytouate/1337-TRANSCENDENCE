import { Module } from '@nestjs/common';
import { authModule } from './AUTH/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { chatModule } from './Chat/chat.gateway.module';

@Module({
  imports: [chatModule ,MailerModule , ConfigModule.forRoot({ isGlobal: true }) , authModule, ProfileModule , PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
