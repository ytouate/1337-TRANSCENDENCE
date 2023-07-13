import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Notification, User } from '@prisma/client';
import { stat } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserSettingsService {
    constructor(private prismaService: PrismaService){}
    

    //block user
    async blockUser(source, target){
        try{
            this.deleteUserFromFriend(source, target);
            this.addUserToBlocking(source, target)
        }catch(error){
            throw new InternalServerErrorException()
        }
    }
    //delete user form friend scalar
    async deleteUserFromFriend(source, target){
        let  userSource= await this.prismaService.user.findFirst({
            where: {
                email: source.email
            },
        });
        let userTarget = await this.prismaService.user.update({
            where: {
                username: target.username,
            },
            data: {
                friends:{
                    disconnect: {
                        id: userSource.id,
                    }
                }
            }
        })
        this.prismaService.user.update({
            where: {
                username: userSource.username,
            },
            data: {
                friends:{
                    disconnect: {
                        id: userTarget.id,
                    }
                }
            }
        })
        return userTarget;
    }
    //push user to block scalar
    async addUserToBlocking(source, target){  
        this.prismaService.user.update({
            where: {
                email: source.email,
            },
            data: {
                blocked:{
                    connect: {
                        username: target.username
                    }
                }
            }
        })
    }
    // search implimentation
    async searchUser(user, pattern){
        
        let sourceUser = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            },
            include: {
                friends: true,
                blocked: true,
                blockedBy: true,
            }
        })
        
        let usersSearch = await this.prismaService.user.findMany({
            where: {
                username: {
                    contains: pattern,
                }
            }
        });
        usersSearch.map((obj: any) =>{
            obj.friendStatus = this.checkUserStatus(sourceUser, obj);
        } )
        console.log(usersSearch);
        return usersSearch;
    }
    //  check status user for the user who make request 
    private checkUserStatus(user, targetUser){
        if (user.blocked.find(obj => obj.email === targetUser.email))
            return 'blocked';
        else if (user.blockedBy.find(obj => obj.email === targetUser.email))
            return  'blockedBy';
        else if (user.friends.find(obj => obj.email === targetUser.email))
            return 'friend'
        else
           return 'notFriend'
    }
    //unblock User
    async unblockUser(source, target){
        this.prismaService.user.update({
            where: {
                email: source.email,
            },
            data: {
                blocked:{
                    disconnect: {
                        username: target.username
                    }
                }
            }
        })
    }
    //return user by id
    async getUser(user, id){
        let sourceUser = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            },
            include: {
                friends: true,
                blocked: true,
                blockedBy: true,
            }
        })
        let userToReturn: any = await this.prismaService.user.findUnique({
            where: {
                id: id
            },
        })
        if (userToReturn){
            userToReturn.friendStatus = this.checkUserStatus(sourceUser, userToReturn);
            return userToReturn;
        }
        return {
            status: 404,
            message: 'user not found'
        }
    }

    async getUserByUsername(name: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: name,
            },
        });
        if (!user)
            // check if user exists
            throw new ForbiddenException('user not found');
        return user;
    }

    async getUserById(userId: number) {
        // console.log('m here');
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                preference: true,
            },
        });

        // or can just return win + loss
        const gamesPlayed = await this.prismaService.game.count({
            where: {
                players: {
                    some: {
                        id: user.id,
                    },
                },
            },
        });

        if (!user)
            // check if user exists
            throw new ForbiddenException('user not found');
        return {
            ...user,
            gamesPlayed,
        };
    }

    async updateUserWin(userId: number) {
        try {
            await this.prismaService.user.update({
                where: {
                    id: userId,
                },
                data: {
                    win: { increment: 1 },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async updateUserLoss(userId: number) {
        try {
            await this.prismaService.user.update({
                where: {
                    id: userId,
                },
                data: {
                    loss: { increment: 1 },
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
