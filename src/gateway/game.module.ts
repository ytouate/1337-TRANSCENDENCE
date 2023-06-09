import { Module } from '@nestjs/common';
import { GameGateWay } from './game.service';
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';

@Module({
    providers: [GameGateWay, GameService],
    imports: [GameModule],
})
export class GateWayModule {}
