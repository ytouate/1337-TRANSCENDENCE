import {
	Controller,
	Post,
	Res,
	Req,
	UseGuards,
	Body,
	Put,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { authService } from './auth.service';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { code, twoFatctor } from 'src/DTO/DTO';

@Controller()
export class authController {
	constructor(private authservice: authService) {}

	@Get('login')
	@UseGuards(AuthGuard('42'))
	login() {}

	@Get('/redirect/signin')
	@UseGuards(AuthGuard('42'))
	async signin(@Res({ passthrough: true }) res, @Req() req) {
		const user = await this.authservice.createUser(req.user);
		const token = await this.authservice.signToken(user.username, user.email);
		await this.authservice.checkUserhave2fa(user);
		res.cookie('Token', token);
		res.cookie('isSignedIn', true);
		res.redirect(`http://${process.env.API_URL}:5173/`);
	}

	@Get('user')
	@UseGuards(AuthGuard('jwt'))
	async getUser(@Req() req) {
		const user = await this.authservice.validateUser(req);
		console.log(user);
		if (user) return user;
		throw new NotFoundException();
	}

	@Get('user/leaderboard')
	@UseGuards(AuthGuard('jwt'))
	async getUserWithWin(@Req() req) {
		return await this.authservice.getUserWithWinRate(req);
	}

	@Post('2fa')
	@UseGuards(AuthGuard('jwt'))
	async siginWith2fa(@Req() request, @Body() body: twoFatctor, @Res() res) {
		console.log('mik');
		const user = await this.authservice.validateUser(request);
		if (!user) return { message: 'unvalide user' };
		await this.authservice.add2fa(user.email, body.email, 0);
		res.cookie('2fa', '2fa');
		return res.status(200).json({ message: 'adding 2fa success' });
	}

	@Post('2fa/validateCode')
	@UseGuards(AuthGuard('jwt'))
	async verificationCode2fa(@Body() body: code, @Req() req) {
		const user = await this.authservice.validateUser(req);
		if (user?.codeVerification == body.code)
			return await this.authservice.setIsSignedInTrue(user, true);
		throw new UnauthorizedException({}, '');
	}

	@Put('disable2fa')
	@UseGuards(AuthGuard('jwt'))
	async disable2fa(@Req() req) {
		return await this.authservice.disable2fa(req.user);
	}

	@Post('logout')
	@UseGuards(AuthGuard('jwt'))
	async logout(@Req() req, @Res() res) {
		await this.authservice.setIsSignedInTrue(req.user, false);
		return res.status(200).json({ message: 'logout succes' });
	}
}
