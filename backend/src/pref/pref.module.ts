import { Module } from '@nestjs/common';
import { PrefController } from './pref.controller';
import { PrefService } from './pref.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PrefController],
    providers: [PrefService],
})
export class PrefModule {}
