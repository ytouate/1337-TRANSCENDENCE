import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";



// @Injectable()
// export class jwtAuth extends PassportStrategy(Strategy, 'jwt')
// {
//     constructor(private jwtservice: JwtService){ super() }

//     async validate(username, email) {
        
//     }
// }