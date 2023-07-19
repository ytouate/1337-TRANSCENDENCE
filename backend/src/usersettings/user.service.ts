import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Notification, User } from '@prisma/client';
import { stat } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { userReturn } from 'src/utils/user.return';

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
        await this.prismaService.user.update({
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
        console.log(target.username);
        let user = await this.prismaService.user.update({
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
    async searchUser(req, pattern){
        
        let sourceUser = await this.prismaService.user.findUnique({
            where: {
                email: req.user.email
            },
            include: {
                friends: true,
                blocked: true,
                blockedBy: true,
            }
        })
        
        let usersSearch: any = await this.prismaService.user.findMany({
            where: {
                username: {
                    contains: pattern,
                }
            }
        });
        let index  = usersSearch.findIndex((user) => user.username == sourceUser.username);
        if (index != -1)
            usersSearch = usersSearch.splice(index ,index);
        usersSearch.map((obj: any) =>{
            obj = userReturn(obj, req);
            
            obj.friendStatus = false;
            obj.me = false;
            let status = this.checkUserStatus(sourceUser, obj);
            if (status == 'blocked'){
                usersSearch.findIndex((user) => user.username == sourceUser.username);
                usersSearch = usersSearch.splice(index ,index);
            }
            else if (status == 'friend')
                obj.friendStatus = true;
            else if (status == 'me')
                obj.me = true;
        } )
        return usersSearch;
    }
    //  check status user for the user who make request 
    private checkUserStatus(user, targetUser){
        if (user.blocked.find(obj => obj.email == targetUser.email))
            return 'blocked';
        else if (user.blockedBy.find(obj => obj.email == targetUser.email))
            return  'blocked';
        else if (user.friends.find(obj => obj.email == targetUser.email))
            return 'friend'
        else if (user.username == targetUser.username)
            return 'me'
        else
           return 'notFriend'
    }
    async unblockUser(source, target){
        await this.prismaService.user.update({
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
    async getUser(req, id: number){
        let sourceUser = await this.prismaService.user.findUnique({
            where: {
                email: req.user.email
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
            include: {
                friends: true,
                blocked: true,
                blockedBy: true,
                notifications: true,
            }
        });
        if (userToReturn){
            userToReturn.friendStatus = false;
            userToReturn.me = false;
            let status = this.checkUserStatus(sourceUser, userToReturn);
            if (status == 'friend')
                userToReturn.friendStatus = true;
            else if (status == 'blocked')
                throw new UnauthorizedException({}, '')
            else if (status == 'me')
                userToReturn.me = true;
            if (userToReturn.me == false) {
                delete userToReturn.friends;
                delete userToReturn.blockedBy;
            }
            delete userToReturn.blockedBy;
            console.log(userToReturn);
            return userReturn(userToReturn, req);
        }
        throw new NotFoundException({}, 'not found');
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
        userId = Math.floor(userId)
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

  async updateUserWin(userId: number, user: User) {
    const win = user.win + 1;
    const totalGames = win + user.loss;
    const winRate = Math.floor((win / totalGames) * 100);
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          win: win,
          winRate: winRate,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserLoss(userId: number, user: User) {
    const loss = user.loss + 1;
    const totalGames = user.win + loss;
    const winRate = Math.floor((user.win / totalGames) * 100);
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          loss: loss,
          winRate: winRate,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
