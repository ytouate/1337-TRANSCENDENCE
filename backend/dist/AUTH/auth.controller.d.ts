import { authService } from "./auth.service";
import { authDto } from "./DTO/auth.DTO";
export declare class authController {
    private authservice;
    constructor(authservice: authService);
    private code;
<<<<<<< HEAD
    gett(): void;
    getProfilee(res: any, req: any): Promise<void>;
    getProfile(req: any): void;
    siginWith2fa(request: any, req: authDto): Promise<"2fa" | "unvalide user">;
=======
    getSucces(): string;
    getProfilee(res: any, req: any): Promise<import(".prisma/client").User>;
    siginWith2fa(request: any, req: authDto): Promise<"" | "unvalide user">;
>>>>>>> 014bf31b71e502defa990d9713b71b463aac6bf2
    verificationCode(body: any): Promise<"code s7i7" | "code ghalate">;
    logout(req: any): Promise<string>;
}
