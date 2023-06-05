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
import { get } from "http";


@Controller()
export class authController {
    constructor(
        private authservice:authService
        ){}
        
        private code;
        
    @Get('login')
    @UseGuards(AuthGuard('42'))
    gett() {}

    @Get('/redirect/signin')
    @UseGuards(AuthGuard('42'))
    async getProfilee(
        @Res({passthrough : true}) res,
        @Req() req) 
    {
        const user = await this.authservice.createUser(req.user)
        const token = await this.authservice.signToken(user.username, user.email)
        await this.authservice.checkUserhave2fa(user)
        console.log(token)
        res.cookie('Token' , token)
        res.redirect('http://localhost:5173/')
        console.log(user)
    }

    @Get('open')
    getProfile() {
        return 'profile'
    }

    @Post('2fa')
    async siginWith2fa(@Req() request , @Body() req: authDto) {
        const user = await this.authservice.validateUser(request.headers.authorization)
        if (!user)
            return 'unvalide user'
        const num = await this.authservice.sigin2fa(this.authservice.generateCode(), req.email)
        this.code = num;
        await this.authservice.add2fa(user.email, req.email, num)
        return '2fa'
    }

    @Post('2fa/validateCode')
    async verificationCode(@Body() body) {
        console.log(this.code)
        console.log(body.code)
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