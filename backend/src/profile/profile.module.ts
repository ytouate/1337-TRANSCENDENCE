import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { JwtStrategy } from 'src/strategies/jwt.strategie';

@Module({
  imports: [PrismaModule, ConfigModule, MulterModule.register({})],
  providers: [
    ProfileService, JwtStrategy],
  controllers: [ProfileController]
})
export class ProfileModule {}
