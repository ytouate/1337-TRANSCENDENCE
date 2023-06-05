import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";



@WebSocketGateway({
    cors : {
        origin : '*'
    }
})
export class chatGateway{

    @SubscribeMessage('newMessage')
    newMessage(@MessageBody() message , @MessageBody('id') id: number) {
        console.log('From newMessage events')
        console.log('id :' , id , 'message recieve :', message)
    }

    @SubscribeMessage('newEventsMessange')
    newMessagefromEvents(@MessageBody() message , @MessageBody('id') id: number) {
        console.log('From newEventsMessage events')
        console.log('id :' , id , 'message recieve :', message)
    }
}