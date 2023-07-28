import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {User} from 'prisma'
import { createReadStream } from 'fs';
import { Response } from 'express';
import { MIMEType } from 'util';
import { lookup } from 'mime-types';
import path from 'path';


@Injectable()
export class ProfileService{
    constructor(private prismaService: PrismaService){
}
    async getProfile(req) {
        const user: User = await this.prismaService.user.findUnique({where : {
            email: req.user.email,
        },
        include: {
          notifications: true,
        }})
        if (user){
          return user;
        }
    }
    async updatePhoto(req, filePath) {
      const updateUser = await this.prismaService.user.update({
        where: {
          email: req.user.email,
        },
        data: {
          urlImage: req.protocol + '://' +
          req.get('host') +
          '/profile/getphoto/' +
          req.user.username,
          imageIsUpdate: false,
          filepath: filePath
        },
      })
      if (updateUser){
        return updateUser;
      }
    }
    async deletePhoto(req) {
        const updateUser = await this.prismaService.user.update({
            where: {
              email: req.user.email,
            },
            data: {
              urlImage: req.protocol + '://' +
              req.get('host') +
              '/profile/getphoto/' +
              req.user.username,
              imageIsUpdate: true,
            },
          })
          if (updateUser){
            return updateUser;
        }
    }
    async updateName(newUserame, req) {
        if (newUserame.length > 10)
          throw new BadRequestException();
        let userToCheck = await this.prismaService.user.findFirst({
          where: {
            username: newUserame,
          }
        })
        if (userToCheck)
          throw new BadRequestException();
        const updateUser = await this.prismaService.user.update({
            where: {
              email: req.user.email,
            },
            data: {
              username: newUserame,
            },
          })
        if (updateUser){
          return updateUser;
        }
    }
    async getPhotoProfile(req, res, username): Promise<StreamableFile>{
       const user: User = await this.prismaService.user.findUnique({where : {
        username: username,
    }})
    if (user){
      let path;
      if (!user.imageIsUpdate)
        path = user.filepath
      else
        path = 'gorilaavatar/Gorilla-Avatar-icon.png';
      const file = createReadStream(path)
      const mimetype = lookup(path)
      res.set({
        'content-type': mimetype
      })
      return new StreamableFile(file);
    }
    }
    async deleteNotification(user, notifications){
      await this.prismaService.notification.delete({
        where:{
          id: notifications.id,
        }
      })
      const toReturn = await this.prismaService.user.findUnique({
        where: {
          email: user.email,
        },
        include: {
          notifications: true
        }
      });
      return user.notification;
    }
    
}
