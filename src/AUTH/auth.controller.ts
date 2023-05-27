import { Controller, Post, Res, Req , UseGuards, Body } from "@nestjs/common";
import { authService } from "./auth.service";
import { Get } from "@nestjs/common";
import { Query } from "@nestjs/common";
import { AuthStrategy } from "./auth.strategy42";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

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
        @Req() req) 
    {
        return this.authservice.createUser(req.user)
    }

    @Get('profile')
    mm(@Req() re : Request) {
        return "lksnd"
    }
    
}