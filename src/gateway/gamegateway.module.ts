import { Module } from '@nestjs/common';
import { GameGateWay } from './gamegateway.service';

@Module({
    providers: [GameGateWay],
})
export class GateWayModule {}
