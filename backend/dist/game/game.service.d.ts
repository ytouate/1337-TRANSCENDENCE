import { PrismaService } from 'src/prisma/prisma.service';
import { GameDto } from './dto';
export declare class GameService {
    private prisma;
    constructor(prisma: PrismaService);
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
    updateGameEnd(gameId: number, score1: number, score2: number, winnerId: number, duration: number): Promise<void>;
}
