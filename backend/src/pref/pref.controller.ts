import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrefService } from './pref.service';
import { PrefDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('pref')
export class PrefController {
    constructor(private prefService: PrefService) {}

    @Get('user/:userId')
    getUserPref(@Param('userId') userId: number) {
        return this.prefService.getUserPref(Number(userId));
    }

    @Post('update')
    updateUserPref(@Body() dto: any) {
        console.log(dto);
        return this.prefService.updateUserPref(dto);
    }
}
