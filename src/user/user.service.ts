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
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            // check if user exists
            throw new ForbiddenException('user not found');

        delete user.hash;
        return user;
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
                    win: { decrement: 1 },
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
