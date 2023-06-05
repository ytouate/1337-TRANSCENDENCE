import { Module } from "@nestjs/common";
import { chatGateway } from "./chat.gateway";


@Module({
    providers : [chatGateway]
})
export class chatModule{}