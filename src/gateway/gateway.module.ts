import { Module } from '@nestjs/common';
import { MyGateWay } from './gateway.service';

@Module({
    providers: [MyGateWay],
})
export class GateWayModule {}
