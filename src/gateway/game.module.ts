import { Module } from '@nestjs/common';
import { GameGateWay } from './game.service';
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';
import { Game } from './gamelogic/Game';
import { UserService } from 'src/user/user.service';
import { PrefService } from 'src/pref/pref.service';
import { UserModule } from 'src/user/user.module';
import { PrefModule } from 'src/pref/pref.module';

@Module({
    providers: [
        GameGateWay,
        GameService,
        UserService,
        PrefService,
    ],
    imports: [GameModule, UserModule, PrefModule],
})
export class GateWayModule {}
