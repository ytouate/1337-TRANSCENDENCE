import { StreamableFile } from '@nestjs/common';
export declare class ProfileController {
    private profileService;
    private: any;
    constructor(profileService: any);
    getProfile(req: any): any;
    updatePhoto(file: any, req: any): any;
    deletePhoto(req: any): any;
    updateName(req: any): any;
    getPhotoProfile(req: any, res: any, username: any): StreamableFile;
}
