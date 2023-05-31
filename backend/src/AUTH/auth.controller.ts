import { Controller, Post, Res, Req , UseGuards, Body, RequestMapping } from "@nestjs/common";
import { authService } from "./auth.service";
import { Get } from "@nestjs/common";
import { Query } from "@nestjs/common";
import { AuthStrategy } from "./auth.strategy42";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { use } from "passport";

@Controller()
export class authController {
    constructor(
        private authservice:authService,
        private configservice:ConfigService,
        private authstratrgy:AuthStrategy
        ){}

    

    @UseGuards(AuthGuard('42'))
    @Get('success')
    getSucces() {
        return 'succesa a'
    }

    @Get('sigin')
    @UseGuards(AuthGuard('42'))
    async getProfilee(
        @Res({passthrough : true}) res,
        @Req() req) 
    {
        const user = await this.authservice.createUser(req.user)
        console.log ("email" + user.email)
        console.log("user name" + user.username)
        const token = await this.authservice.signToken(user.email, user.username)
        console.log(token)
        res.cookie('Token' , token)
        return user
    }
}