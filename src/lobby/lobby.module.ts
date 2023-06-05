import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';

@Module({
    controllers: [LobbyController],
    providers: [LobbyService],
})
export class LobbyModule {}
