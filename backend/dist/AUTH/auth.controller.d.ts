import { authService } from "./auth.service";
import { authDto } from "./DTO/auth.DTO";
export declare class authController {
    private authservice;
    constructor(authservice: authService);
    private code;
    gett(): void;
    getProfilee(res: any, req: any): Promise<void>;
    getProfile(req: any): void;
    siginWith2fa(request: any, req: authDto): Promise<"2fa" | "unvalide user">;
    verificationCode(body: any): Promise<"code s7i7" | "code ghalate">;
    logout(req: any): Promise<string>;
}
