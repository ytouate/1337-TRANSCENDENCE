import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/Prisma/prisma.service";
import { imageLink } from "./auth.strategy42";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";

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
            console.log('craete new user')
            let newUser = await this.prisma.user.create({
                data : {
                    email : newData.email,
                    username : newData.username,
                    urlImage : imageLink,
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
        const  user = await this.prisma.user.updateMany(
            {
                where : {email : firstMail},
                data : { optionalMail : email , codeVerification : code}
            },
        )
    }

    //validate user
    async validateUser(data, req) : Promise<any>{
        let user = await this.prisma.user.findUnique({where : {email : data.email} ,
        include: {
            friends: true,
        }});
        return this.userReturn(user, req)
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
    private userReturn(user, req){
        if (user.imageIsUpdate && user.urlImage) user.urlImage = req.protocol + "://" + req.get('host') + "/profile/getphoto";
        const {email, imageIsUpdate, id ,...result} = user;
        return result;
      }

    // validate User with { Token }
}