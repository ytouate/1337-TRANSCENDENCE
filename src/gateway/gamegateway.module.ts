import { Module } from '@nestjs/common';
import { GameGateWay } from './gamegateway.service';

@Module({
    providers: [MyGateWay],
})
export class GateWayModule {}
