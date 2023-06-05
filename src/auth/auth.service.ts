import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, LoginDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async signup(dto: AuthDto) {
        const hash =  await argon.hash(dto.password);

        try {

            const user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    hash,
                },
            });
            delete user.hash;
            return user;
        } catch (error) {
            if (error.code === 'P2002') { // defined error, stands for duplicate field (unique)
                // throw new ForbiddenException('Email is already taken');
                const targetFields = error.meta?.target as string[] | undefined;
                if (targetFields) {
                  if (targetFields.includes('email')) {
                    throw new ForbiddenException('Email is already taken');
                  }
                  if (targetFields.includes('username')) {
                    throw new ForbiddenException('Username is already taken');
                  }
                }
            }
            throw error;
        }
    }

    async login(login: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                username : login.username
            },
        });

        if (!user)  // check if user exists
            throw new ForbiddenException("Credentials not correct");
        
        const pw = await argon.verify(user.hash, login.password);

        if (!pw)
            throw new ForbiddenException("Credentials not correct");

        delete user.hash;

        return this.signToken(user.id, user.username);
    }

    async signToken(userId: number, username: string) : Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            username,
        }
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '5m',
            secret: secret,

        });

        return {
            access_token : token,
        };
    }
} 