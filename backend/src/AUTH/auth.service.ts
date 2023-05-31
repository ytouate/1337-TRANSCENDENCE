import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, PrismaPromise } from "@prisma/client";
import { throws } from "assert";
import { PrismaService } from "src/prisma/prisma.service";
import { imageLink } from "./auth.strategy42";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class authService{
    constructor( 
        private prisma:PrismaService,
        private configservice:ConfigService,
        private jwt:JwtService
    ){}
    
    async createUser(newData) {
        const user = await this.prisma.user.findUnique( {where : { email : newData.email} })
        if (!user)
        {
            console.log('craete new user')
            let newUser = await this.prisma.user.create({
                data : {
                    email : newData.email,
                    username : newData.username,
                    urlImage : imageLink
                } 
            })
            return newUser
        }
        return user
    }


    async signToken(email, username)  {
        const payload = {
            username : username,
            email : email
        }
        return await this.jwt.signAsync(payload)
    }
}