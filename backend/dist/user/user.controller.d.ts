import { UserService } from './user.service';
import { authService } from 'src/AUTH/auth.service';
export declare class UserController {
    private userService;
    private user;
    constructor(userService: UserService, user: authService);
    createRoom(Param: any, req: any): Promise<string | import(".prisma/client").chatRoom>;
    setAdmin(Param: any): Promise<string>;
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
