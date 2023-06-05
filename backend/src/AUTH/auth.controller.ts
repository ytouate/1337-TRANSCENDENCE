import { Controller, Post, Res, Req , UseGuards, Body, RequestMapping } from "@nestjs/common";
import { authService } from "./auth.service";
import { Get } from "@nestjs/common";
import { Query } from "@nestjs/common";
import { AuthStrategy } from "./auth.strategy42";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { authDto } from "./DTO/auth.DTO";
import { use } from "passport";
import { connected } from "process";
import { json } from "stream/consumers";
import { log } from "console";


@Controller()
export class authController {
    constructor(
        private authservice:authService
        ){}
        
        private code;
        
        
    @Get('success')
    getSucces(@Req() req) {
        console.log()
        return {data : "lansds"}
    }

    @Get('signin')
    @UseGuards(AuthGuard('42'))
    async getProfilee(
        @Res({passthrough : true}) res,
        @Req() req) 
    {
        console.log('her backend')
        const user = await this.authservice.createUser(req.user)
        const token = await this.authservice.signToken(user.username, user.email)
        await this.authservice.checkUserhave2fa(user)
        //console.log(token)
        res.cookie('Token' , token)
        res.redirect('http://localhost:5173')
    }

    @Get('profil')
    getProfile(@Req() req) {
        console.log(req.headers.authorization)
        return {name: 'Youssef'}
    }
 
    @Post('2fa')
    async siginWith2fa(@Req() request , @Body() req: authDto) {
        const user = await this.authservice.validateUser(request.headers.authorization)
        if (!user)
            return 'unvalide user'
        const num = await this.authservice.sigin2fa(this.authservice.generateCode(), req.email)
        await this.authservice.add2fa(user.email, req.email, num)
        return ''
    }

    @Post('2fa/validateCode')
    async verificationCode(@Body() body) {
        if (this.code == body.code)
            return 'code s7i7'
        return 'code ghalate'
    }
}