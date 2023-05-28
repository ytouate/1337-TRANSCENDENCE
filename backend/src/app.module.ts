import { Module } from '@nestjs/common';
import { authModule } from './AUTH/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }) , authModule, PrismaModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
