import { Module } from '@nestjs/common';
import { authModule } from './AUTH/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [MailerModule , ConfigModule.forRoot({ isGlobal: true }) , authModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
