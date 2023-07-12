import { Injectable, StreamableFile } from '@nestjs/common';
import { IProfileService } from './iprofile.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import {User} from 'prisma'
import { createReadStream } from 'fs';
import { Response } from 'express';
import { MIMEType } from 'util';
import { lookup } from 'mime-types';
import { userReturn } from 'src/utils/user.return';


@Injectable()
export class ProfileService implements IProfileService{
    constructor(private prismaService: PrismaService){
}
    async getProfile(req) {
        console.log(req.user)
        const user: User = await this.prismaService.user.findUnique({where : {
            email: req.user.email,
        }})
        if (user){
          return userReturn(user, req)
        }
    }
    async updatePhoto(req, filePath) {
      const updateUser = await this.prismaService.user.update({
        where: {
          email: req.user.email,
        },
        data: {
          urlImage: filePath,
          imageIsUpdate: true,
        },
      })
      if (updateUser){
        return userReturn(updateUser, req)
      }
    }
    async deletePhoto(req) {
        const updateUser = await this.prismaService.user.update({
            where: {
              email: req.user.email,
            },
            data: {
              urlImage: null,
            },
          })
          if (updateUser){
            return userReturn(updateUser, req)
        }
    }
    async updateName(newUserame, req) {
        const updateUser = await this.prismaService.user.update({
            where: {
              email: req.user.email,
            },
            data: {
              username: newUserame,
            },
          })
        if (updateUser){
          return userReturn(updateUser, req);
        }
    }
    async getPhotoProfile(req, res, username): Promise<StreamableFile>{
       const user: User = await this.prismaService.user.findUnique({where : {
        username: username,
    }})
    if (user){
        const file = createReadStream(user.urlImage);
        const mimetype = lookup(user.urlImage)
        res.set({
          'content-type': mimetype
        })
        return new StreamableFile(file);
    }
    }
}
