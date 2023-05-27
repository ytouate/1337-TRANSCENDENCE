import { Module } from '@nestjs/common';
import { authModule } from './AUTH/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }) , authModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
