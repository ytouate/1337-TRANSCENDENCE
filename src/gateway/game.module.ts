import { Module } from '@nestjs/common';
import { GameGateWay } from './game.service';
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Game } from './gamelogic/Game';

@Module({
    providers: [GameGateWay],
    imports: [GameModule, ScheduleModule.forRoot()],
})
export class GateWayModule {}
