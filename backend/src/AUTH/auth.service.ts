import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { imageLink } from "./auth.strategy42";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import { userReturn } from "src/utils/user.return";
import { use } from "passport";

@Injectable()
export class authService{
    constructor( 
        private prisma:PrismaService,
        private configservice:ConfigService,
        private jwt:JwtService,
        private mail:MailerService
    ){}
    
    // add user to db
    async createUser(newData)
    {
        const user = await this.prisma.user.findUnique( {where : { email : newData.email} })
        if (!user)
        {
            let newUser = await this.prisma.user.create({
                data : {
                    email : newData.email,
                    username : newData.username,
                    urlImage : imageLink,
                    preference: {
                        create: {},
                    },
                } 
            })
            const payload = {
                email : newData.email,
                username : newData.username
            }
            return newUser
        }
        return user
    }

    // generate a Token
    async signToken(username, email)
    {
        const payload = {
            username : username,
            email : email
        }
        return await this.jwt.signAsync(payload)
    }


    // add two-factor Authantication
    async add2fa(firstMail , email, code)
    {
        const  user = await this.prisma.user.update(
            {
                where : {email : firstMail},
                data : { optionalMail : email , codeVerification : code}
            },
        )
    }

    //validate user
    async validateUser(req) : Promise<any>{
        const user =  await this.prisma.user.findUnique({where : {email : req.user.email} ,
            include: {
                friends: true,
                preference : true,
                notifications : true
            },
        })
        return userReturn(user, req)
    }

        //validate user
        async getUserWithWinRate(req) : Promise<any>{
            const users =  await this.prisma.user.findMany({
             orderBy : { winRate: 'asc'}
            })
            const usersToReturn = [];
            for (const user of users) {
                usersToReturn.push(userReturn(user, req));
            }
            return usersToReturn; 
            // return userReturn(users, req)
        }


    // send code verification { email } 
    async sigin2fa(code, email)
    {
        const mail = await this.mail.sendMail({
            from : 'othmanmallah13@gmail.com',
            to : email,
            subject : 'DKOORA Game',
            template :'confirme',
            context : {
                code : code,
            },
            html : `<h1> code : ${code} </h1>`
        })
        return code
    }


    // generate a secret code
    generateCode()
    {
        return Math.floor(1000 + Math.random() * 90000)
    }

    // check if he acticvate Two-factor Authantication
    async checkUserhave2fa(user)
    {
        if (user.optionalMail)
        {
            const code = await this.sigin2fa(this.generateCode(), user.optionalMail)
            this.add2fa(user.email, user.optionalMail, code)
        }
    }

    // set isSignedin true
    async   setIsSignedInTrue(user, status)
    {
        return await this.prisma.user.update(
            {
                where : {email : user.email},
                data : {isSignedIn : status},
                include: {
                    friends: true,
                    preference: true,
                }
            }
        )
    }

    // disable 2fa
    async   disable2fa(user)
    {
        return await this.prisma.user.update(
            {
                where : {email : user.email},
                data : {optionalMail : null}
            }
        )
    }
}