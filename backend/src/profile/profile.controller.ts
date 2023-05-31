import { Controller, Delete, Get, Inject, Put, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { IProfileService } from './iprofile.service';
import { diskStorage } from 'multer';
import {InterfacePfoileServiceProvider } from './iprofile.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mimeTypes from 'mime-types';
import { createReadStream } from 'fs';


@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
    private 
    constructor(@Inject(InterfacePfoileServiceProvider) private profileService){}
   
    @Get('')
    getProfile(@Req() req){
        console.log(req.user)
        return this.profileService.getProfile(req);
    }
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './profileimages',
            filename: (req, file, callback) => {
                const extension = file.mimetype;
                const filename = req.user.email + '.' + mimeTypes.extension(extension);
                callback(null, filename);
            }
        })
    }))
    @Put('updatephoto')
    updatePhoto(@UploadedFile() file, @Req() req){
        console.log(req.get('host'));
        return this.profileService.updatePhoto(req, file.path);
    }
    @Delete('deletephoto')
    deletePhoto(@Req() req){
        return this.profileService.deletePhoto(req)
    }
    @Put('updatename')
    updateName(@Req() req){
        return this.profileService.updateName(req.body.username, req);
    }
    @Get('getphoto')
    getPhotoProfile(@Req() req, @Res({ passthrough: true }) res): StreamableFile {
        return this.profileService.getPhotoProfile(req, res);
    }
}
