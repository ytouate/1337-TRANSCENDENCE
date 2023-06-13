import { PrismaService } from 'src/Prisma/prisma.service';
export declare class UserService {
    private prismaService;
    constructor(prismaService: PrismaService);
    creatRoom(name: any, user: any): Promise<string | import(".prisma/client").chatRoom>;
    addUserToRoom(user: any, name: any): Promise<void>;
    deleteUserFromRoom(user: any, name: any): Promise<void>;
    getAllRooms(): Promise<(import(".prisma/client").chatRoom & {
        users: import(".prisma/client").User[];
    })[]>;
    getRoomByName(name: any): Promise<import(".prisma/client").chatRoom & {
        users: import(".prisma/client").User[];
        messages: (import(".prisma/client").Message & {
            user: import(".prisma/client").User;
        })[];
    }>;
    addStatusOfUser(user: any, status: any): Promise<void>;
    avoidDuplicate(user: any, name: any): Promise<import(".prisma/client").User>;
    addDataInMessageTable(data: any, id: any, user: any): Promise<import(".prisma/client").Message>;
    putDataInDatabase(name: any, data: any, user: any): Promise<void>;
}
