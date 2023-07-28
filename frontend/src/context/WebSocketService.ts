import { Socket, io } from 'socket.io-client';
import socketIO from 'socket.io-client';
import Cookies from 'js-cookie';

class WebSocketService {
    private socket: Socket | null = null;

    connect(): any {
        if (!this.socket) {
            this.socket = socketIO('http://localhost:3000/game', {
                autoConnect: false,
                extraHeaders: {
                    Authorization: `Bearer ${Cookies.get('Token')}`,
                },
            });
            this.socket.connect();
        }
        return this.socket;
    }

    disconnect(): void {
        this.socket?.disconnect();
        this.socket = null;
        console.log('socket disconnected');
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

const webSocketService = new WebSocketService();

export default webSocketService;
