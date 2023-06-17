import { Module } from '@nestjs/common';
import { PrefController } from './pref.controller';
import { PrefService } from './pref.service';

@Module({
    controllers: [PrefController],
    providers: [PrefService],
})
export class PrefModule {}
