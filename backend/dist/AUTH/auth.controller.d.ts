import { authService } from "./auth.service";
import { authDto } from "./DTO/auth.DTO";
export declare class authController {
    private authservice;
    constructor(authservice: authService);
    private code;
    gett(): void;
    getProfilee(res: any, req: any): Promise<void>;
    getp(req: any): Promise<any>;
    siginWith2fa(request: any, body: authDto): Promise<"unvalide user" | {
        status: number;
        message: string;
    }>;
    verificationCode(body: any, req: any): Promise<any>;
    logout(req: any): Promise<string>;
}
