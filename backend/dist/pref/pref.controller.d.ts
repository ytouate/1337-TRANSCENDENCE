import { PrefService } from './pref.service';
import { PrefDto } from './dto';
export declare class PrefController {
    private prefService;
    constructor(prefService: PrefService);
    getUserPref(userId: number): Promise<import(".prisma/client").Preference>;
    updateUserPref(dto: PrefDto): Promise<void>;
}
