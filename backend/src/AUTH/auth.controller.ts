import { Controller, Post, Res, Req , UseGuards, Body, Put, Delete} from "@nestjs/common";
import { authService } from "./auth.service";
import { Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


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
    async signin(
        @Res({passthrough : true}) res,
        @Req() req) 
    {
        const user = await this.authservice.createUser(req.user)
        const token = await this.authservice.signToken(user.username, user.email)
        await this.authservice.checkUserhave2fa(user)
        res.cookie('Token' , token)
        res.cookie('isSignedIn' , true)
        res.redirect('http://localhost:5173/')
    }


    @Get('user')
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Req() req) {
        const user = await this.authservice.validateUser(req)
        if (user)
            return user;
        return {'message' : 'user not found'}
    }
 

    @Post('2fa')
    @UseGuards(AuthGuard('jwt'))
    async siginWith2fa(@Req() request , @Body() req, @Res() res)
    {
        const user = await this.authservice.validateUser(request)
        if (!user)
            return {'message' : 'unvalide user'}
        await this.authservice.add2fa(user.email, req.email, 0)
        res.cookie('2fa' , '2fa')
        return res.status(200).json({'message' : 'adding 2fa success'})
    }
 

    @Post('2fa/validateCode')
    @UseGuards(AuthGuard('jwt'))
    async verificationCode2fa(@Body() body, @Req() req)
    {
        const user = await this.authservice.validateUser(req)

        if (user && user.codeVerification  == body.code)
        {
            return await this.authservice.setIsSignedInTrue(user, true)
        }
        return {'message' : 'incorrect code'}
    }

    @Put('disable2fa')
    @UseGuards(AuthGuard('jwt'))
    async disable2fa(@Req() req)
    {
        return await this.authservice.disable2fa(req.user)
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    async logout(@Req() req, @Res() res) {
        //res.delete('isSignedIn')
        await this.authservice.setIsSignedInTrue(req.user, false)
        return res.status(200).json({'message' : 'logout succes'})
    }
}