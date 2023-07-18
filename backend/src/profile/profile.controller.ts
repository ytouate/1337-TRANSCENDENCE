import { Controller, Delete, Get, Inject, Param, Put, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mimeTypes from 'mime-types';
import { createReadStream } from 'fs';
import { ProfileService } from './profile.service';



@Controller('profile')
export class ProfileController {
    constructor( private profileService: ProfileService){}
   
    @UseGuards(AuthGuard('jwt'))
    @Get('')
    getProfile(@Req() req){
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
    @UseGuards(AuthGuard('jwt'))
    @Put('updatephoto')
    updatePhoto(@UploadedFile() file, @Req() req){
        console.log(req);
        return this.profileService.updatePhoto(req, file.path);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('deletephoto')
    deletePhoto(@Req() req){
        return this.profileService.deletePhoto(req)
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('updatename')
    updateName(@Req() req){
        return this.profileService.updateName(req.body.username, req);
    }
    @Get('getphoto/:username')
    getPhotoProfile(@Req() req, @Res({ passthrough: true }) res, @Param('username') username): Promise<StreamableFile> {
        return this.profileService.getPhotoProfile(req, res, username);
    }
    @Get('deletenotification')
    getNotification(@Req() req){
        return this.profileService.deleteNotification(req.user, req.body);
    }
}
