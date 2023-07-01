import { UserService } from './user.service';
import { authService } from 'src/AUTH/auth.service';
export declare class UserController {
    private userService;
    private user;
    constructor(userService: UserService, user: authService);
    createRoom(Param: any, req: any): Promise<any>;
    setAdmin(Param: any): Promise<string>;
    changePassword(Param: any): Promise<string>;
    getRoomByName(Param: any): Promise<any>;
    getAllRooms(Param: any): Promise<any>;
}
