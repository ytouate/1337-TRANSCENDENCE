import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private configservice:ConfigService){
        super({
            datasources : {
                db : {
                    url : configservice.get('DATABASE_URL')
                }
            }
        })
    }
}
