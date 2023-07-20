import { Global, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { request } from "http";
import { Strategy , ExtractJwt} from "passport-jwt";

@Global()
@Injectable()
export class webSocketJwtStrategy extends PassportStrategy (Strategy, 'websocket-jwt'){
    constructor(private configService: ConfigService){
        
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: any) => {
                return request.handshake.headers.authorization.slice(7);
            }]),
            secretOrKey: configService.get('SECRET'),
        })
    }
    async validate(payload: any){
        console.log(payload)
        return (payload);
    }
}