import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserSettingsService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserSettingsController {
    constructor(private userService: UserSettingsService){}
    @Post('block')
    blockUser(@Req() req, @Body() body){
        this.userService.blockUser(req.user, body);
    }
    @Delete('unfriend')
    unfriedUser(@Req() req, @Body() body){
        this.userService.deleteUserFromFriend(req.user, body);
    }
    
    @Delete('unblock')
    unblockUser(@Req() req, @Body() body){
        this.userService.unblockUser(req.user, body);
    }
    @Get('search/:pattern')
    searchUsers(@Req() req, @Param('pattern') pattern){
        return this.userService.searchUser(req.user, pattern)
    }
    @Get(':id')
    getUser(@Req() req, @Param('id') id){
        return this.userService.getUser(req.user, parseInt(id));
    } 

}


