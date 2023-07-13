import { Controller, Post, Res, Req , UseGuards, Body, RequestMapping, HttpStatus } from "@nestjs/common";
import { authService } from "./auth.service";
import { Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { authDto } from "./DTO/auth.DTO";


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
        res.cookie('Token' , token)
        res.redirect('http://localhost:5173/')
    }


    @Get('user')
    @UseGuards(AuthGuard('jwt'))
    async getp(@Req() req) {
        const user = await this.authservice.validateUser(req)
        if (user)
            return user
        return {'message' : 'user not found'}
    }
 

    @Post('2fa')
    @UseGuards(AuthGuard('jwt'))
    async siginWith2fa(@Req() request , @Body() req)
    {
        const user = await this.authservice.validateUser(request)
        if (!user)
            return {'message' : 'unvalide user'}
        await this.authservice.add2fa(user.email, req.email, 0)
        return {'status' : 200 , 'message' : 'adding 2fa success'}
    }


    @Post('2fa/validateCode')
    @UseGuards(AuthGuard('jwt'))
    async verificationCode(@Body() body, @Req() req)
    {
        const user = await this.authservice.validateUser(req)
        if (user && user.code  == body.code)
            return user
        return {'message' : 'incorrect code'}
    }


    @Post('logout')
    async logout(@Req() req) {
        console.log(req.headers.authorization)
        return 'delete JWT token from client'
    }
}