import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    createRoom(Param: any, req: any): Promise<string | import(".prisma/client").chatRoom>;
    setAdmin(Param: any): Promise<string>;
    muteUser(Param: any): Promise<import(".prisma/client").chatRoom>;
    changePassword(Param: any): Promise<string>;
    getRoomByName(Param: any): Promise<import(".prisma/client").chatRoom & {
        users: import(".prisma/client").User[];
        messages: (import(".prisma/client").Message & {
            user: import(".prisma/client").User;
        })[];
    }>;
    getAllRooms(Param: any): Promise<(import(".prisma/client").chatRoom & {
        users: import(".prisma/client").User[];
    })[]>;
}
