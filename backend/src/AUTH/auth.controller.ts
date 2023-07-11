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
        console.log('her backend')
        const user = await this.authservice.createUser(req.user)
        const token = await this.authservice.signToken(user.username, user.email)
        await this.authservice.checkUserhave2fa(user)
        res.cookie('Token' , token, { httpOnly: false })
        res.redirect('http://localhost:5173')
    }


    @Get('user')
    @UseGuards(AuthGuard('jwt'))
    async getp(@Req() req) {
        const user = await this.authservice.validateUser(req.user)
        if (user)
            return user
        return {error: 'user not found', status: 404}
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
    @UseGuards(AuthGuard('jwt'))
    async verificationCode(@Body() body, @Req() req) {
        if (this.code == body.code)
            return await this.authservice.validateUser(req.user)
        return 'code ghalate'
    }


    @Post('logout')
    async logout(@Req() req) {
        console.log(req.headers.authorization)
        return 'delete JWT token from client'
    }
}