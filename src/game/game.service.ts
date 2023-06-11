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

    async getLiveGame() {
        try {
            const games = await this.prisma.game.findMany({
                where: {
                    status: 'OUTGOING',
                },
            });
            return games;
        } catch (error) {
            throw error;
        }
    }

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
                        connect: [
                            { id: dto.player1 },
                            { id: dto.player2 },
                        ],
                    },
                },
                include: {
                    players: true,
                },
            });
            if (!game) {
                throw new ForbiddenException(
                    'Error while creating game',
                );
            }
            return game;
        } catch (error) {
            throw error;
        }
    }
}
