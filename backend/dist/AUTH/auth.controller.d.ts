import { authService } from "./auth.service";
export declare class authController {
    private authservice;
    constructor(authservice: authService);
    private code;
    gett(): void;
    getProfilee(res: any, req: any): Promise<void>;
    getp(req: any): Promise<any>;
    siginWith2fa(request: any, req: any): Promise<{
        message: string;
        status?: undefined;
    } | {
        status: number;
        message: string;
    }>;
    verificationCode(body: any, req: any): Promise<any>;
    logout(req: any): Promise<string>;
}
