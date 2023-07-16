import { Controller, ExecutionContext, Render } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { join } from "path";
import { createReadStream } from "fs";
import { Http2ServerRequest } from "http2";
import * as bcrypt from 'bcrypt'


@Controller()
export class appController{

    @Get('name')
    async Home(context : ExecutionContext) {
        const saltOrRounds = 10;
        const password = 'random_password';
        const hash = await bcrypt.hash(password, saltOrRounds);
        console.log(hash)
    }


    @Get('api/chat')
    getindex() {
        return 'message'
    }
}