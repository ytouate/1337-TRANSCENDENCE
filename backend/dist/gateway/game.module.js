"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateWayModule = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const game_service_2 = require("../game/game.service");
const game_module_1 = require("../game/game.module");
const pref_service_1 = require("../pref/pref.service");
const pref_module_1 = require("../pref/pref.module");
const user_service_1 = require("../usersettings/user.service");
const user_module_1 = require("../usersettings/user.module");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_module_1 = require("../prisma/prisma.module");
let GateWayModule = class GateWayModule {
};
GateWayModule = __decorate([
    (0, common_1.Module)({
        imports: [game_module_1.GameModule, user_module_1.UserSettingsModule, pref_module_1.PrefModule, prisma_module_1.PrismaModule],
        providers: [
            game_service_1.GameGateWay, user_service_1.UserSettingsService, game_service_2.GameService, pref_service_1.PrefService, prisma_service_1.PrismaService
        ],
    })
], GateWayModule);
exports.GateWayModule = GateWayModule;
//# sourceMappingURL=game.module.js.map