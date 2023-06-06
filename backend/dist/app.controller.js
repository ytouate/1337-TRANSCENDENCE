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
exports.appController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
let appController = class appController {
    getindex() {
        const file = (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), '/src/static/index.html'));
        console.log(file);
        return '';
    }
};
__decorate([
    (0, common_2.Get)('index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], appController.prototype, "getindex", null);
appController = __decorate([
    (0, common_1.Controller)()
], appController);
exports.appController = appController;
//# sourceMappingURL=app.controller.js.map