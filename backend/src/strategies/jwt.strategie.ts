import { Global, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy , ExtractJwt} from "passport-jwt";

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy (Strategy, 'jwt'){
    constructor(private configService: ConfigService){
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('SECRET'),
        })
    }
    async validate(payload: any){
        console.log(payload)
        return (payload);
    }
}