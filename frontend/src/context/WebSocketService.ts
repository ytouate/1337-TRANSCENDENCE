import { Socket, io } from 'socket.io-client';
import socketIO from 'socket.io-client';
import Cookies from 'js-cookie';

class WebSocketService {
    private socket: Socket | null = null;

    connect(): any {
        if (!this.socket) {
            this.socket = socketIO.connect('http://localhost:3000/game', {
                extraHeaders: {
                    Authorization: `Bearer ${Cookies.get('Token')}`,
                },
            });
        }
        // console.log('socket connected');
        return this.socket;
    }

    disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
        // console.log('socket disconnected');
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

const webSocketService = new WebSocketService();

export default webSocketService;
