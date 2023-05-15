import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController{
    constructor(private authService: AuthService) {
        // this.authService = authService;
    }

    @Post('signup')
    signup() {
        return this.authService.signup();
    }

    @Post('login')
    login() {
        return this.authService.login();
    }
}