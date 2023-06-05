import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LobbyService } from './lobby/lobby.service';
import { LobbyController } from './lobby/lobby.controller';
import { LobbyModule } from './lobby/lobby.module';
import { GateWayModule } from './gateway/gateway.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        UserModule,
        PrismaModule,
        GateWayModule,
        LobbyModule,
    ],
    providers: [LobbyService],
    controllers: [LobbyController],
})
export class AppModule {}
