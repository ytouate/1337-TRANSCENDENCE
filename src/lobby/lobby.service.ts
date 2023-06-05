import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LobbyDto } from './dto';

@Injectable()
export class LobbyService {
    constructor(private prisma: PrismaService) {}

    async joinLobby(dto: LobbyDto) {
        try {
            const lobby = await this.prisma.lobby.findUnique({
                where: {
                    name: dto.lobbyName,
                },
                include: {
                    players: true,
                },
            });
            if (!lobby) {
                console.log('Lobby doesnt exist');
                throw new HttpException(
                    'Lobby not found',
                    HttpStatus.NOT_FOUND,
                );
            } else {
                console.log('Lobby exists');

                if (lobby.players.length < 2) {
                    const updatedLobby = await this.prisma.lobby.update({
                        where: { id: lobby.id },
                        data: {
                            players: { connect: { id: dto.userId } },
                        },
                        include: { players: true },
                    });
                    return updatedLobby;
                } else {
                    console.log('Lobby full');
                    throw new HttpException(
                        'Lobby is already full',
                        HttpStatus.FORBIDDEN,
                    );
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async createLobby(dto: LobbyDto) {
        try {
            const lobby = await this.prisma.lobby.findUnique({
                where: {
                    name: dto.lobbyName,
                },
                include: {
                    players: true,
                },
            });

            if (!lobby) {
                console.log('creating a lobby');
                const newLobby = await this.prisma.lobby.create({
                    data: {
                        name: dto.lobbyName,
                        players: {
                            connect: { id: dto.userId },
                        },
                    },
                    include: { players: true },
                });
                return newLobby;
            } else {
                console.log('lobby already exists');
                throw new HttpException(
                    'Lobby name already exists',
                    HttpStatus.CONFLICT,
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async removeLobby() {}
}
