"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./AUTH/auth.module");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const profile_module_1 = require("./Profile/profile.module");
const mailer_1 = require("@nestjs-modules/mailer");
const user_module_1 = require("./usersettings/user.module");
const notification_module_1 = require("./notification/notification.module");
const chat_gateway_module_1 = require("./Chat/chat.gateway.module");
const chat_gateway_1 = require("./Chat/chat.gateway");
const app_controller_1 = require("./app.controller");
const user_service_1 = require("./user/user.service");
const user_module_2 = require("./user/user.module");
const game_service_1 = require("./game/game.service");
const pref_service_1 = require("./pref/pref.service");
const game_service_2 = require("./gateway/game.service");
const game_module_1 = require("./game/game.module");
const pref_module_1 = require("./pref/pref.module");
const game_module_2 = require("./gateway/game.module");
const prisma_service_1 = require("./Prisma/prisma.service");
const user_service_2 = require("./usersettings/user.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_2.UserModule, chat_gateway_module_1.chatModule, notification_module_1.NotificationModule,
            profile_module_1.ProfileModule, mailer_1.MailerModule, config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.authModule, prisma_module_1.PrismaModule, user_module_1.UserSettingsModule, notification_module_1.NotificationModule, game_module_1.GameModule,
            pref_module_1.PrefModule, game_module_2.GateWayModule],
        controllers: [app_controller_1.appController],
        providers: [user_service_1.UserService, app_controller_1.appController, chat_gateway_1.chatGateway, game_service_1.GameService, pref_service_1.PrefService, game_service_2.GameGateWay, prisma_service_1.PrismaService, user_service_2.UserSettingsService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map