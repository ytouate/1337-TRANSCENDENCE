import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Put, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mimeTypes from 'mime-types';
import { createReadStream } from 'fs';
import { ProfileService } from './profile.service';
import * as fs from 'fs';
import {  UsernameUpdateDto } from 'src/DTO/username.dto';


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
        }),
        fileFilter: (req, file, callback) => {
            if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/jpg')
                callback(new Error('file type not allowed'),false);
            if (file.size > 700000)
                callback(new Error('size not allowed'), false);
            callback(null, true);
        }
    }))
    @UseGuards(AuthGuard('jwt'))
    @Put('updatephoto')
    updatePhoto(@UploadedFile() file, @Req() req){
        return this.profileService.updatePhoto(req, file.path);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('deletephoto')
    deletePhoto(@Req() req){
        return this.profileService.deletePhoto(req)
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('updatename')
    updateName(@Req() req, @Body() body: UsernameUpdateDto){
        return this.profileService.updateName(body.username, req);
    }
    @Get('getphoto/:username')
    getPhotoProfile(@Req() req, @Res({ passthrough: true }) res, @Param('username') username): Promise<StreamableFile> {
        return this.profileService.getPhotoProfile(req, res, username);
    }
    @Delete('deletenotification')
    getNotification(@Req() req){
        return this.profileService.deleteNotification(req.user, req.body);
    }
}
