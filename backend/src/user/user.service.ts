import { Injectable } from '@nestjs/common';
import { Notification, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService){}

    // sendFriendRequest(notif: Notification, user: User){
        // const receiver = this.prismaService.user.findFirst({
            // where:{
                // username: user.username
            // }
        // })
        // const notification = this.prismaService.notification.create({
            // data:{
                // description: 'lsdkflksdjf',
                // title: 'request',
                // sender: {
                    // 
                // }
            // }
        // }
        // )
    // }

}
