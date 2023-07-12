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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefController = void 0;
const common_1 = require("@nestjs/common");
const pref_service_1 = require("./pref.service");
const dto_1 = require("./dto");
let PrefController = class PrefController {
    constructor(prefService) {
        this.prefService = prefService;
    }
    getUserPref(userId) {
        return this.prefService.getUserPref(Number(userId));
    }
    updateUserPref(dto) {
        return this.prefService.updateUserPref(dto);
    }
};
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PrefController.prototype, "getUserPref", null);
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PrefDto]),
    __metadata("design:returntype", void 0)
], PrefController.prototype, "updateUserPref", null);
PrefController = __decorate([
    (0, common_1.Controller)('pref'),
    __metadata("design:paramtypes", [pref_service_1.PrefService])
], PrefController);
exports.PrefController = PrefController;
//# sourceMappingURL=pref.controller.js.map