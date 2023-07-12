import { Module } from '@nestjs/common';
import { UserSettingsController } from './user.controller';
import { UserSettingsService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/strategies/jwt.strategie';

@Module({
  imports: [PrismaModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService, JwtStrategy]
})
export class UserSettingsModule {}
