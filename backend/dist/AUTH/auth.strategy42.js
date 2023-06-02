"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStrategy = exports.imageLink = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
exports.imageLink = '';
let AuthStrategy = class AuthStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(configservice) {
        super({
            clientID: configservice.get('CLIENT_ID'),
            clientSecret: configservice.get('CLIENT_SECRET'),
            callbackURL: configservice.get('CALLBACKURL')
        });
        this.configservice = configservice;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { emails, username, id, photos } = profile;
        const user = {
            username,
            email: emails[0].value,
            picture: photos[0].value,
            userId: id,
            accessToken
        };
        exports.imageLink = profile._json.image.link;
        done(null, user);
    }
};
AuthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthStrategy);
exports.AuthStrategy = AuthStrategy;
//# sourceMappingURL=auth.strategy42.js.map