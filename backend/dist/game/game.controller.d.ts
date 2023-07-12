import { GameService } from './game.service';
import { GameDto } from './dto';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    getAll(): Promise<import(".prisma/client").Game[]>;
    getLiveGame(): Promise<(import(".prisma/client").Game & {
        players: import(".prisma/client").User[];
    })[]>;
    getUserGames(userId: number): Promise<(import(".prisma/client").Game & {
        players: import(".prisma/client").User[];
    })[]>;
    createGame(dto: GameDto): Promise<import(".prisma/client").Game & {
        players: import(".prisma/client").User[];
    }>;
}
