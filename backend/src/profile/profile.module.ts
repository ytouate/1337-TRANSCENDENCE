import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {InterfacePfoileServiceProvider } from './iprofile.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './profile.guard';
import { MulterModule } from '@nestjs/platform-express';

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
