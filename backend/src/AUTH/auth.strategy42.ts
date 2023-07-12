import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-42'


export var imageLink = ''

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, '42') {
    constructor (private readonly configservice:ConfigService) { 
        
        super({
            clientID : configservice.get('CLIENT_ID') ,
            clientSecret : configservice.get('CLIENT_SECRET'),
            callbackURL : configservice.get('CALLBACKURL')
        })
    }

        async validate(accessToken : string , refreshToken : string , profile : any , done : VerifyCallback) : Promise<any> { 
            const {emails, username, id, photos} = profile;
            const user = {
                        username,
                        email : emails[0].value,
                        picture : photos[0].value,
                        userId: id,
                        accessToken
                    };
            imageLink = profile._json.image.link 
            done(null, user)
        }  
}