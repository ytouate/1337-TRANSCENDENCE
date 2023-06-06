import { Logger, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket ,Server } from "socket.io";



@WebSocketGateway({ namespace : 'chat'})
export class chatGateway  {

    // @WebSocketServer()
    // server : Server;

    @SubscribeMessage('message')
    onMessage(@MessageBody() body: any) {
        console.log(body)
        //this.server.emit('onMessage' , body)
    }

    // onModuleInit() {
    //     this.server.on('coonection', (socket) => {
    //         console.log(socket.id)
    //         console.log('connected')
    //     })
    // }



}