import { authService } from "./auth.service";
import { AuthStrategy } from "./auth.strategy42";
import { ConfigService } from "@nestjs/config";
export declare class authController {
    private authservice;
    private configservice;
    private authstratrgy;
    constructor(authservice: authService, configservice: ConfigService, authstratrgy: AuthStrategy);
    getSucces(): string;
    getProfilee(res: any, req: any): Promise<import(".prisma/client").user>;
}
