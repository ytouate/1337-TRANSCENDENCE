import { Module } from '@nestjs/common';
import { authModule } from './AUTH/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { MailerModule } from '@nestjs-modules/mailer';
import {  UserSettingsModule } from './usersettings/user.module';
import { NotificationModule } from './notification/notification.module';
import { chatModule } from './Chat/chat.gateway.module';
import { chatGateway } from './Chat/chat.gateway';
import { appController } from './app.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { GameService } from './game/game.service';
import { PrefService } from './pref/pref.service';
import { GameGateWay } from './gateway/game.service';
import { GameModule } from './game/game.module';
import { PrefModule } from './pref/pref.module';
import { GateWayModule } from './gateway/game.module';
import { PrismaService } from './prisma/prisma.service';
import { UserSettingsService } from './usersettings/user.service';

@Module({
  imports: [UserModule ,chatModule ,NotificationModule, 
          ProfileModule, MailerModule , ConfigModule.forRoot({ isGlobal: true }) ,
          authModule, PrismaModule, UserSettingsModule, NotificationModule, GameModule,
          PrefModule, GateWayModule],
  controllers: [appController],
  providers: [UserService, appController, chatGateway, GameService, PrefService, GameGateWay, PrismaService, UserSettingsService],
})
export class AppModule {}
