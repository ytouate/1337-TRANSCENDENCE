import { Injectable } from '@nestjs/common';
import { IProfileService } from './iprofile.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService implements IProfileService{
    constructor(private prismaService: PrismaService){
}
    getProfile() {
    }
    updatePhotos() {
        throw new Error('Method not implemented.');
    }
    deletePhotos() {
        throw new Error('Method not implemented.');
    }
    updateName() {
        throw new Error('Method not implemented.');
    }
}
