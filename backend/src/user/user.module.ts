import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { authService } from 'src/AUTH/auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [authService, UserService]
})
export class UserModule {}
