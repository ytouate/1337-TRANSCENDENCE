import { Module } from '@nestjs/common';
import { GameGateWay } from './game.service';

@Module({
    providers: [GameGateWay],
})
export class GateWayModule {}
