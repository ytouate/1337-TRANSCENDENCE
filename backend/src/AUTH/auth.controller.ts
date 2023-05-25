import { Controller, Post } from "@nestjs/common";
import { authService } from "./auth.service";
import { Get } from "@nestjs/common";
import { Body } from "@nestjs/common";
import { Req } from "@nestjs/common";
import { ApiOAuth2 } from "@nestjs/swagger";
import { ClientRequest } from "http";
import { concatAll } from "rxjs";



@Controller()
export class authController {
    constructor(private authservice:authService){}

    @Get('sigin')
    getProfile(@Req() req:Request) {
        

    }

    @Get('profile')
    getProfilee() {
        console.log("hana")
        return "kk"
    }
    
}