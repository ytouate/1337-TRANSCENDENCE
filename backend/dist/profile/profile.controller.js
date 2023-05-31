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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const iprofile_service_1 = require("./iprofile.service");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const mimeTypes = require("mime-types");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    getProfile(req) {
        console.log(req.user);
        return this.profileService.getProfile(req);
    }
    updatePhoto(file, req) {
        console.log(req.get('host'));
        return this.profileService.updatePhoto(req, file.path);
    }
    deletePhoto(req) {
        return this.profileService.deletePhoto(req);
    }
    updateName(req) {
        return this.profileService.updateName(req.body.username, req);
    }
    getPhotoProfile(req, res) {
        return this.profileService.getPhotoProfile(req, res);
    }
};
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './profileimages',
            filename: (req, file, callback) => {
                const extension = file.mimetype;
                const filename = req.user.email + '.' + mimeTypes.extension(extension);
                callback(null, filename);
            }
        })
    })),
    (0, common_1.Put)('updatephoto'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "updatePhoto", null);
__decorate([
    (0, common_1.Delete)('deletephoto'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Put)('updatename'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "updateName", null);
__decorate([
    (0, common_1.Get)('getphoto'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", common_1.StreamableFile)
], ProfileController.prototype, "getPhotoProfile", null);
ProfileController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('profile'),
    __param(0, (0, common_1.Inject)(iprofile_service_1.InterfacePfoileServiceProvider)),
    __metadata("design:paramtypes", [Object])
], ProfileController);
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map