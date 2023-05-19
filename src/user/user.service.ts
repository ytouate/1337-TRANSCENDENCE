import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService ) { }

    async getUserByUsername(name: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: name,
            }
        });
        if (!user)  // check if user exists
            throw new ForbiddenException("user not found");
        
        delete user.hash;
        return ({user});
    }
}
