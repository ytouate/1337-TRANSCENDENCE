import { Controller, Render } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { join } from "path";
import { createReadStream } from "fs";

@Controller()
export class appController{

    @Get('name')
    Home(name) {
        return { message : `Heelo world ${name}`}
    }


    @Get('api/chat')
    getindex() {
        return 'message'
    }
}