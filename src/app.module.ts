import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

import { GateWayModule } from './gateway/game.module';
import { GameModule } from './game/game.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        UserModule,
        PrismaModule,
        GateWayModule,
        GameModule,
    ],
    providers: [],
    controllers: [],
})
export class AppModule {}
