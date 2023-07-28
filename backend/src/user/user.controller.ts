import {
    Controller,
    Post,
    Get,
    UseGuards,
    Put,
    Req,
    Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { body, password } from 'src/DTO/DTO';


@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Post('addAdmin')
    async setAdmin(@Body() Body: body) {
        return await this.userService.setAdmin(Body)
    }

    @Post('mute')
    async muteUser(@Body() body: body) {
        return await this.userService.muteUsers(body)
    }

    @Post('unmute')
    async deleteMuteUser(@Body() body: body) {
        return await this.userService.deleteUserFromMuteUsers(body);
    }

    @Put('changePassword')
    async changePassword(@Body() body: password) {
        return await this.userService.changePasswordOfProtectedRoom(body)
    }

    @Post('deletePassword')
    async deletePasword(@Body() body: password) {
        return await this.userService.deletePasswordOfProtectedRoom(body)
    }


    @Get('getRoom')
    async getRoomByName(@Body() body, @Req() req) {
        const room = await this.userService.getRoomByName(body.roomName)
        if (room) {
            return room
        }
    }

    @Get('getRooms')
    async getAllRooms(@Req() req) {
        return await this.userService.getAllRooms(req)
    }
}