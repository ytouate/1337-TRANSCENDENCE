import { Controller, Post, Res, Req , UseGuards, Body, RequestMapping, HttpStatus } from "@nestjs/common";
import { authService } from "./auth.service";
import { Get } from "@nestjs/common";
import { Query } from "@nestjs/common";
import { AuthStrategy } from "./auth.strategy42";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { authDto } from "./DTO/auth.DTO";
import { use } from "passport";
import { connected } from "process";
<<<<<<< HEAD
import { get } from "http";
=======
import { json } from "stream/consumers";
import { log } from "console";
>>>>>>> 213800d318b14a783cec77bcd78b7408f27fe5b5


@Controller()
export class authController {
    constructor(
        private authservice:authService
        ){}
        
        private code;
        
<<<<<<< HEAD
    @Get('login')
    @UseGuards(AuthGuard('42'))
    gett() {}

    @Get('/redirect/signin')
=======
        
    @Get('success')
    getSucces(@Req() req) {
        console.log()
        return {data : "lansds"}
    }

    @Get('signin')
>>>>>>> 213800d318b14a783cec77bcd78b7408f27fe5b5
    @UseGuards(AuthGuard('42'))
    async getProfilee(
        @Res({passthrough : true}) res,
        @Req() req) 
    {
        console.log('her backend')
        const user = await this.authservice.createUser(req.user)
        const token = await this.authservice.signToken(user.username, user.email)
        await this.authservice.checkUserhave2fa(user)
<<<<<<< HEAD
        res.cookie('Token' , token, { httpOnly: false })
        res.redirect('http://localhost:5173/')
    }

    @Get('user')
    @UseGuards(AuthGuard('jwt'))
    async getp(@Req() req) {
        const user = await this.authservice.validateUser(req.user)
        if (user)
            return user
        return 'user not found'
=======
        //console.log(token)
        res.cookie('Token' , token)
        res.redirect('http://localhost:5173')
>>>>>>> 213800d318b14a783cec77bcd78b7408f27fe5b5
    }

    @Get('profil')
    getProfile(@Req() req) {
        console.log(req.headers.authorization)
        return {name: 'Youssef'}
    }
 
    @Post('2fa')
    @UseGuards(AuthGuard('jwt'))
    async siginWith2fa(@Req() request , @Body() req: authDto) {
        const user = await this.authservice.validateUser(request.user)
        if (!user)
            return 'unvalide user'
        const num = await this.authservice.sigin2fa(this.authservice.generateCode(), req.email)
        this.code = num;
        await this.authservice.add2fa(user.email, req.email, num)
        return '2fa'
    }

    @Post('2fa/validateCode')
    async verificationCode(@Body() body) {
        if (this.code == body.code)
            return 'code s7i7'
        return 'code ghalate'
    }

    @Post('logout')
    async logout(@Req() req) {
        console.log(req.headers.authorization)
        return 'delete JWT token from client'
    }
}