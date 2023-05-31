import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
export declare class authService {
    private prisma;
    private configservice;
    private jwt;
    constructor(prisma: PrismaService, configservice: ConfigService, jwt: JwtService);
    createUser(newData: any): Promise<import(".prisma/client").user>;
    signToken(email: any, username: any): Promise<string>;
}
