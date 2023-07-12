"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GameService = class GameService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll() {
        try {
            const games = await this.prisma.game.findMany();
            return games;
        }
        catch (error) {
            throw error;
        }
    }
    async getLiveGame() {
        try {
            const games = await this.prisma.game.findMany({
                where: {
                    status: 'OUTGOING',
                },
                include: {
                    players: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return games;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserGames(userId) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async createGame(dto) {
        try {
            const game = await this.prisma.game.create({
                data: {
                    players: {
                        connect: [
                            { id: dto.player1 },
                            { id: dto.player2 },
                        ],
                    },
                    playerOrder: dto.player1,
                },
                include: {
                    players: true,
                },
            });
            if (!game) {
                throw new common_1.ForbiddenException('Error while creating game');
            }
            return game;
        }
        catch (error) {
            throw error;
        }
    }
    async updateGameEnd(gameId, score1, score2, winnerId, duration) {
        try {
            await this.prisma.game.update({
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
            });
        }
        catch (error) {
            throw error;
        }
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map