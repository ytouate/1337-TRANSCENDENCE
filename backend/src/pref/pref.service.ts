import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrefDto } from './dto';

@Injectable()
export class PrefService {
    constructor(private prisma: PrismaService) {}

    async getUserPref(userId: number) {
        try {
            const pref = await this.prisma.preference.findUnique({
                where: {
                    userId: userId,
                },
            });

            if (!pref) {
                throw new ForbiddenException('Prefs not found');
            }

            return pref;
        } catch (error) {

            throw error;
        }
    }

    async updateUserPref(dto: any) {
        try {
            await this.prisma.preference.update({
                data: {
                    ballColor: dto.ballColor,
                    mapTheme: dto.mapTheme,
                    paddleColor: dto.paddleColor,
                },
                where: {
                    id: parseInt(dto.id),
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
