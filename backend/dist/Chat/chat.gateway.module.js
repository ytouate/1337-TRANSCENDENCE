"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_gateway_1 = require("./chat.gateway");
const prisma_module_1 = require("src/Prisma/prisma.module");
const prisma_service_1 = require("src/Prisma/prisma.service");
const user_module_1 = require("../user/user.module");
const user_service_1 = require("../user/user.service");
let chatModule = class chatModule {
};
chatModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, prisma_module_1.PrismaModule],
        providers: [user_service_1.UserService, prisma_service_1.PrismaService, chat_gateway_1.chatGateway]
    })
], chatModule);
exports.chatModule = chatModule;
//# sourceMappingURL=chat.gateway.module.js.map