import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy , ExtractJwt} from "passport-jwt";

@Injectable()
export class ProfileGuard extends PassportStrategy (Strategy){
    constructor(){
        super({
            jwtRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            
        })
    }
}