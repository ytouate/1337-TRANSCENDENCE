import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {
        // this.authService = authService;
    }

    @Post('signup')
    async signup(@Body() dto: AuthDto) {
        const hash = argon.hash(dto.password);

        const user = await prisma.user.create({
            data: {
                
            }
        })
        return this.authService.signup(dto);
    }

    @Post('login')
    login() {
        return this.authService.login();
    }
}