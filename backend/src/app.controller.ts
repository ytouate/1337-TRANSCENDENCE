import { Controller } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { join } from "path";
import { createReadStream } from "fs";

@Controller()
export class appController{

    @Get('index')
    getindex() {
        const file = createReadStream(join(process.cwd(), '/src/static/index.html'));
        console.log(file);
        return ''
    }
}