import { Controller, Post , Get, Req, Query, UseGuards, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { authService } from 'src/AUTH/auth.service';


@Controller('user')
export class UserController {

    constructor (
        private userService:UserService,
        private user:authService
        ){}

    @Post('createRoom')
    @UseGuards(AuthGuard('jwt'))
    async createRoom(@Query() Param, @Req() req) {
        const user = await this.user.validateUser(req.user)
        if (!user)
            return 'u can\'t\ create a room'
        return await this.userService.creatRoom(Param, user)
    }

    @Post('addAdmin')
    @UseGuards(AuthGuard('jwt'))
    async setAdmin(@Query() Param) {
        await this.userService.setAdmin(Param)
        return `the user ${Param.username} has moved from member to admin`
    }

    @Post('changePassword')
    @UseGuards(AuthGuard('jwt'))
    async   changePassword(@Query() Param) {
        await   this.userService.changePasswordOfProtectedRoom(Param)
        return 'the password has changed'
    }

    @Get('getRoom')
    async getRoomByName(@Query() Param) {
        return await this.userService.getRoomByName(Param.roomName)
    }

    @Get('getRooms')
    async getAllRooms(@Query() Param) {
        return await this.userService.getAllRooms()
    }
}
