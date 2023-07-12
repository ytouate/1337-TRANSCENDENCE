import { StreamableFile } from '@nestjs/common';
import { IProfileService } from './iprofile.service';
import { PrismaService } from 'src/Prisma/prisma.service';
export declare class ProfileService implements IProfileService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getProfile(req: any): Promise<any>;
    updatePhoto(req: any, filePath: any): Promise<any>;
    deletePhoto(req: any): Promise<any>;
    updateName(newUserame: any, req: any): Promise<any>;
    getPhotoProfile(req: any, res: any, username: any): Promise<StreamableFile>;
}
