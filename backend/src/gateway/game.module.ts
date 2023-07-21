import { Module } from '@nestjs/common';
import { GameGateWay } from './game.service';
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';
import { PrefService } from 'src/pref/pref.service';
import { PrefModule } from 'src/pref/pref.module';
import { UserSettingsService } from 'src/usersettings/user.service';
import { UserSettingsModule } from 'src/usersettings/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [GameModule, UserSettingsModule, PrefModule, PrismaModule],
    providers: [UserSettingsService, GameService, PrefService, PrismaService],
})
export class GateWayModule {}
