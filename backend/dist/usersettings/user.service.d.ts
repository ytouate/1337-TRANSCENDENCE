import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserSettingsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    blockUser(source: any, target: any): Promise<void>;
    deleteUserFromFriend(source: any, target: any): Promise<User>;
    addUserToBlocking(source: any, target: any): Promise<void>;
    searchUser(user: any, pattern: any): Promise<User[]>;
    private checkUserStatus;
    unblockUser(source: any, target: any): Promise<void>;
    getUser(user: any, id: any): Promise<User | {
        status: number;
        message: string;
    }>;
    getUserByUsername(name: string): Promise<User>;
    getUserById(userId: number): Promise<{
        gamesPlayed: number;
        id: number;
        email: string;
        socketId: string;
        username: string;
        urlImage: string;
        imageIsUpdate: boolean;
        optionalMail: string;
        codeVerification: number;
        status: string;
        win: number;
        loss: number;
        preference: import(".prisma/client").Preference;
    }>;
    updateUserWin(userId: number): Promise<void>;
    updateUserLoss(userId: number): Promise<void>;
}
