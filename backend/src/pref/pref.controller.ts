import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrefService } from './pref.service';
import { PrefDto } from './dto';

@Controller('pref')
export class PrefController {
    constructor(private prefService: PrefService) {}

    @Get('user/:userId')
    getUserPref(@Param('userId') userId: number) {
        return this.prefService.getUserPref(Number(userId));
    }

    @Post('update')
    updateUserPref(@Body() dto: PrefDto) {
        return this.prefService.updateUserPref(dto);
    }
}
