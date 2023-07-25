import { Controller, Post , Get, Query, UseGuards, Put, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { userReturn } from 'src/utils/user.return';


@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {

    constructor ( 
        private userService:UserService
        ){}

    @Post('addAdmin')
    async setAdmin(@Query() Param) {
        return await this.userService.setAdmin(Param)
    }

    @Post('muteUser')
    async   muteUser(@Query() Param) {
        return await this.userService.muteUsers(Param)
    } 


    @Post('changePassword')
    async   changePassword(@Query() Param) {
        return await   this.userService.changePasswordOfProtectedRoom(Param)
    }

    @Get('getRoom')
    async getRoomByName(@Query() Param, @Req() req) {
        const room = await this.userService.getRoomByName(Param.roomName)
        const usersToReturn = [];
        for (const user of room.users) {
            usersToReturn.push(userReturn(user, req));
        }
        room.users = usersToReturn; 
        return room
    }

    @Get('getRooms')
    async getAllRooms(@Query() Param) {
        return await this.userService.getAllRooms()
    }
}
