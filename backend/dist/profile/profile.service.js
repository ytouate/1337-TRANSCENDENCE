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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../Prisma/prisma.service");
const fs_1 = require("fs");
const mime_types_1 = require("mime-types");
let ProfileService = class ProfileService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getProfile(req) {
        console.log(req.user);
        const user = await this.prismaService.user.findUnique({ where: {
                email: req.user.email,
            } });
        if (user) {
            return this.userReturn(user, req);
        }
    }
    async updatePhoto(req, filePath) {
        const updateUser = await this.prismaService.user.update({
            where: {
                email: req.user.email,
            },
            data: {
                urlImage: filePath,
                imageIsUpdate: true,
            },
        });
        if (updateUser) {
            return this.userReturn(updateUser, req);
        }
    }
    async deletePhoto(req) {
        const updateUser = await this.prismaService.user.update({
            where: {
                email: req.user.email,
            },
            data: {
                urlImage: null,
            },
        });
        if (updateUser) {
            return this.userReturn(updateUser, req);
        }
    }
    async updateName(newUserame, req) {
        const updateUser = await this.prismaService.user.update({
            where: {
                email: req.user.email,
            },
            data: {
                username: newUserame,
            },
        });
        if (updateUser) {
            return this.userReturn(updateUser, req);
        }
    }
    async getPhotoProfile(req, res) {
        const user = await this.prismaService.user.findUnique({ where: {
                email: req.user.email,
            } });
        if (user) {
            const file = (0, fs_1.createReadStream)(user.urlImage);
            const mimetype = (0, mime_types_1.lookup)(user.urlImage);
            res.set({
                'content-type': mimetype
            });
            return new common_1.StreamableFile(file);
        }
    }
    userReturn(user, req) {
        if (user.imageIsUpdate && user.urlImage)
            user.urlImage = req.protocol + "://" + req.get('host') + "/profile/getphoto";
        const { email, imageIsUpdate, id } = user, result = __rest(user, ["email", "imageIsUpdate", "id"]);
        return result;
    }
};
ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map