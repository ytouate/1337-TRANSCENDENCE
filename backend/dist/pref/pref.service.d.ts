import { PrismaService } from 'src/prisma/prisma.service';
import { PrefDto } from './dto';
export declare class PrefService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserPref(userId: number): Promise<import(".prisma/client").Preference>;
    updateUserPref(dto: PrefDto): Promise<void>;
}
