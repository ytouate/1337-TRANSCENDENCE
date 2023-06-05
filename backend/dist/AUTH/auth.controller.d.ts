import { authService } from "./auth.service";
import { authDto } from "./DTO/auth.DTO";
export declare class authController {
    private authservice;
    constructor(authservice: authService);
    private code;
    getSucces(): {
        data: string;
    };
    getProfilee(res: any, req: any): Promise<void>;
    getProfile(req: any): {
        name: string;
    };
    siginWith2fa(request: any, req: authDto): Promise<"" | "unvalide user">;
    verificationCode(body: any): Promise<"code s7i7" | "code ghalate">;
}
