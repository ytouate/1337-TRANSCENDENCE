import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GameService } from './game.service';
import { GameDto } from './dto';

// @UseGuards(JwtGuard)
@Controller('game')
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
