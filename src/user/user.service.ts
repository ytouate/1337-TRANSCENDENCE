import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserByUsername(name: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: name,
            },
        });
        if (!user)
            // check if user exists
            throw new ForbiddenException('user not found');

        delete user.hash;
        return user;
    }

    async getUserById(userId: number) {
        // console.log('m here');
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                preference: true,
            },
        });

        // or can just return win + loss
        const gamesPlayed = await this.prisma.game.count({
            where: {
                players: {
                    some: {
                        id: user.id,
                    },
                },
            },
        });

        if (!user)
            // check if user exists
            throw new ForbiddenException('user not found');

        delete user.hash;
        return {
            ...user,
            gamesPlayed,
        };
    }

    async updateUserWin(userId: number) {
        try {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    win: { increment: 1 },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async updateUserLoss(userId: number) {
        try {
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    loss: { increment: 1 },
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
