import { Injectable } from "@nestjs/common";


@Injectable()
export class authService{

    profile() {
        return "my profile"
    }
}