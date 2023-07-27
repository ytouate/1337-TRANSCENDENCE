import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameDto } from './dto';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}

    async getAll() {
        try {
            const games = await this.prisma.game.findMany();
            return games;
        } catch (error) {
            throw error;
        }
    }

    async getLiveGame(userId: number) {
        try {
            const games = await this.prisma.game.findMany({
                where: {
                    status: 'OUTGOING',
                    NOT: {
                        players: {
                            some: {
                                id: {
                                    equals: userId,
                                },
                            },
                        },
                    },
                },
                include: {
                    players: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return games;
        } catch (error) {
            throw error;
        }
    }

    // async getLiveGame() {
    //     try {
    //         const games = await this.prisma.game.findMany({
    //             where: {
    //                 status: 'OUTGOING',
    //             },
    //             include: {
    //                 players: true,
    //             },
    //             orderBy: {
    //                 createdAt: 'desc',
    //             },
    //         });
    //         return games;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async getUserGames(userId: number) {
        try {
            const games = await this.prisma.game.findMany({
                where: {
                    status: 'FINISHED',
                    players: {
                        some: {
                            id: userId,
                        },
                    },
                },
                include: {
                    players: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return games;
        } catch (error) {
            throw error;
        }
    }

    async createGame(dto: GameDto) {
        try {
            const game = await this.prisma.game.create({
                data: {
                    players: {
                        connect: [{ id: dto.player1 }, { id: dto.player2 }],
                    },
                    playerOrder: dto.player1,
                },
                include: {
                    players: true,
                },
            });
            if (!game) {
                throw new ForbiddenException('Error while creating game');
            }
            return game;
        } catch (error) {
            throw error;
        }
    }

    async updateGameState(
        gameId: number,
        score1: number,
        score2: number,
        duration: number,
    ) {
        try {
            const updatedGame = await this.prisma.game.update({
                where: {
                    id: gameId,
                },
                data: {
                    score1: score1,
                    score2: score2,
                    duration: duration,
                },
                include: {
                    players: true,
                },
            });
            return updatedGame;
        } catch (error) {
            throw error;
        }
    }

    async updateGameEnd(
        gameId: number,
        score1: number,
        score2: number,
        winnerId: number,
        duration: number,
    ) {
        try {
            const updatedGame = await this.prisma.game.update({
                where: {
                    id: gameId,
                },
                data: {
                    status: 'FINISHED',
                    score1: score1,
                    score2: score2,
                    winnerId: winnerId,
                    duration: duration,
                },
                include: {
                    players: true,
                },
            });
            return updatedGame;
        } catch (error) {
            throw error;
        }
    }
}
