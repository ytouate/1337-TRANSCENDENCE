import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, PrismaPromise } from "@prisma/client";
import { throws } from "assert";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class authService{
    constructor( 
        private prisma:PrismaService,
        private configservice:ConfigService   
    ){}
    
    async createUser(newData) {
        const user = await this.prisma.user.findUnique( {where : { email : newData.email} })
        if (!user)
        {
            console.log('craete new user')
            const newUser = await this.prisma.user.create({
                data : {
                    email : newData.email,
                    username : newData.username
                } 
            })
            
            return newUser
        }
        console.log('login exist')
        return user
    }
}