import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {InterfacePfoileServiceProvider } from './iprofile.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { JwtStrategy } from 'src/strategies/jwt.strategie';

@Module({
  imports: [PrismaModule, ConfigModule, MulterModule.register({})],
  providers: [
  {
    provide: InterfacePfoileServiceProvider,
    useClass: ProfileService,
  }, JwtStrategy],
  controllers: [ProfileController]
})
export class ProfileModule {}
