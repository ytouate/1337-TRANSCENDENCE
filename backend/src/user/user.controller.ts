import { Controller, Post , Get, Req, Query, UseGuards} from '@nestjs/common';
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
        return await this.userService.creatRoom(Param.roomName , user)
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
