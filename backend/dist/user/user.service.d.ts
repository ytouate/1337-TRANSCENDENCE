import { PrismaService } from 'src/Prisma/prisma.service';
export declare class UserService {
    private prismaService;
    constructor(prismaService: PrismaService);
    creatRoom(Param: any, user: any): Promise<any>;
    addUserToRoom(user: any, name: any): Promise<void>;
    deleteUserFromRoom(user: any, name: any): Promise<void>;
    getAllRooms(): Promise<any>;
    getRoomByName(name: any): Promise<any>;
    addStatusOfUser(user: any, status: any): Promise<void>;
    avoidDuplicate(user: any, name: any): Promise<any>;
    addDataInMessageTable(data: any, id: any, user: any): Promise<any>;
    putDataInDatabase(name: any, data: any, user: any): Promise<void>;
    joiningTheRoom(param: any, user: any): Promise<string>;
    getUserWithUsername(name: any): Promise<any>;
    setAdmin(param: any): Promise<void>;
    changePasswordOfProtectedRoom(param: any): Promise<void>;
}
