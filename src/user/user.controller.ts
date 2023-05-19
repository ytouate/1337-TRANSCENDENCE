import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';


@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getUser(@GetUser() user: User) {
        return user;
    }

    @Get('username/:username')
    getUserByUsername(@Param('username') username: string) {
        console.log('query: ' + username);
        return this.userService.getUserByUsername(username);
    }

}
