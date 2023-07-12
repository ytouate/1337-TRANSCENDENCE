import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
declare const webSocketJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class webSocketJwtStrategy extends webSocketJwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
