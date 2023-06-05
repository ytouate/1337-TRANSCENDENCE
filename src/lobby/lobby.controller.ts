import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { LobbyService } from './lobby.service';
import { LobbyDto } from './dto';

@UseGuards(JwtGuard)
@Controller('lobby')
export class LobbyController {
    constructor(private lobbyServer: LobbyService) {}

    @Post('join')
    joinLobby(@Body() dto: LobbyDto) {
        return this.lobbyServer.joinLobby(dto);
    }

    @Post('create')
    createLobby(@Body() dto: LobbyDto) {
        return this.lobbyServer.createLobby(dto);
    }

    @Delete('delete/:lobbyId')
    deleteLobby(@Param('lobbyId') lobbyId: number) {
        return this.lobbyServer.deleteLobby(lobbyId);
    }
}
