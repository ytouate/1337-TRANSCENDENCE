import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prismaService;
    constructor(prismaService: PrismaService);
    creatRoom(Param: any, user: any): Promise<{
        message: string;
    }>;
    addUserToRoom(user: any, name: any): Promise<void>;
    deleteUserFromRoom(user: any, name: any): Promise<{
        message: any;
    }>;
    getAllRooms(): Promise<(import(".prisma/client").chatRoom & {
        users: import(".prisma/client").User[];
        messages: import(".prisma/client").Message[];
    })[]>;
    getRoomByName(name: any): Promise<import(".prisma/client").chatRoom & {
        users: import(".prisma/client").User[];
        messages: (import(".prisma/client").Message & {
            user: import(".prisma/client").User;
        })[];
    }>;
    avoidDuplicate(user: any, name: any): Promise<import(".prisma/client").User>;
    addDataInMessageTable(data: any, id: any, user: any): Promise<import(".prisma/client").Message>;
    putDataInDatabase(name: any, data: any, user: any): Promise<void>;
    joiningTheRoom(param: any, user: any): Promise<boolean>;
    getUserWithUsername(name: any): Promise<import(".prisma/client").User>;
    setAdmin(param: any): Promise<import(".prisma/client").chatRoom>;
    changePasswordOfProtectedRoom(param: any): Promise<void>;
    a: any;
    banUser(param: any): Promise<import(".prisma/client").chatRoom>;
    muteUsers(param: any): Promise<import(".prisma/client").chatRoom>;
    validateUserToCreateChat(req: any): Promise<import(".prisma/client").User>;
}
