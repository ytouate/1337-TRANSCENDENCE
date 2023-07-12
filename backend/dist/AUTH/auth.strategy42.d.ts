import { ConfigService } from "@nestjs/config";
import { VerifyCallback } from 'passport-42';
export declare var imageLink: string;
declare const AuthStrategy_base: new (...args: any[]) => any;
export declare class AuthStrategy extends AuthStrategy_base {
    private readonly configservice;
    constructor(configservice: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
