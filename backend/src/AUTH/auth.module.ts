import { Module } from "@nestjs/common";
import { authService } from "./auth.service";
import { authController } from "./auth.controller";

@Module({
    imports : [],
    controllers : [ authController],
    providers : [authService]
})
export class authModule {}