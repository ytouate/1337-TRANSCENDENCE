import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GameDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
    constructor(private gameService: GameService) {}

    @Get('all')
    getAll() {
        return this.gameService.getAll();
    }

    @Get('live')
    getLiveGame() {
        return this.gameService.getLiveGame();
    }

    @Get('user/:userId')
    getUserGames(@Param('userId') userId: number) {
        return this.gameService.getUserGames(Number(userId));
    }

    @Post('create')
    createGame(@Body() dto: GameDto) {
        return this.gameService.createGame(dto);
    }
}
