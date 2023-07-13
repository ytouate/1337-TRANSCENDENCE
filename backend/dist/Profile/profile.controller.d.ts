import { StreamableFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
export declare class ProfileController {
    private profileService;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<any>;
    updatePhoto(file: any, req: any): Promise<any>;
    deletePhoto(req: any): Promise<any>;
    updateName(req: any): Promise<any>;
    getPhotoProfile(req: any, res: any, username: any): Promise<StreamableFile>;
}
