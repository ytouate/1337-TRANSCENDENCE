import { Controller, Delete, Get, Inject, Put } from '@nestjs/common';
import { IProfileService } from './iprofile.service';
import {InterfacePfoileServiceProvider } from './iprofile.service';

@Controller('profile')
export class ProfileController {
    constructor(@Inject(InterfacePfoileServiceProvider) profileService){}
    @Get('')
    getProfile(){
        return 'iii';
    }
    @Put('updatephoto')
    updatePhoto(){
    }
    @Delete('deletephoto')
    deletePhoto(){

    }
    @Put('updatename')
    updateName(){
        
    }
}
