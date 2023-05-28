import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {InterfacePfoileServiceProvider } from './iprofile.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
  {
    provide: InterfacePfoileServiceProvider,
    useClass: ProfileService,
  }],
  controllers: [ProfileController]
})
export class ProfileModule {}
