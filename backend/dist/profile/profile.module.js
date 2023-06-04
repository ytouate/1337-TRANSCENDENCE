"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const profile_controller_1 = require("./profile.controller");
const iprofile_service_1 = require("./iprofile.service");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_strategie_1 = require("../strategies/jwt.strategie");
let ProfileModule = class ProfileModule {
};
ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule, platform_express_1.MulterModule.register({})],
        providers: [
            {
                provide: iprofile_service_1.InterfacePfoileServiceProvider,
                useClass: profile_service_1.ProfileService,
            }, jwt_strategie_1.JwtStrategy
        ],
        controllers: [profile_controller_1.ProfileController]
    })
], ProfileModule);
exports.ProfileModule = ProfileModule;
//# sourceMappingURL=profile.module.js.map