import { UserSettingsService } from './user.service';
export declare class UserSettingsController {
    private userService;
    constructor(userService: UserSettingsService);
    blockUser(req: any, body: any): void;
    unfriedUser(req: any, body: any): void;
    unblockUser(req: any, body: any): void;
    searchUsers(req: any, pattern: any): Promise<import(".prisma/client").User[]>;
    getUser(req: any, id: any): Promise<any>;
}
