import { Controller, Post , Get, Req, Query, UseGuards, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { authService } from 'src/AUTH/auth.service';


@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {

    constructor (
        private userService:UserService
        ){}

    @Post('addAdmin')
    async setAdmin(@Query() Param) {
        await this.userService.setAdmin(Param)
        return {'message' : `the user ${Param.username} has moved from member to admin`}
    }

    @Post('muteUser')
    async   muteUser(@Query() Param) {
        return await this.userService.muteUsers(Param)
    } 


    @Post('changePassword')
    async   changePassword(@Query() Param) {
        await   this.userService.changePasswordOfProtectedRoom(Param)
        return {'meesage' : 'the password has changed'}
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
