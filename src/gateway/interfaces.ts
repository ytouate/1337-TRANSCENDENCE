import { Socket } from "socket.io";

export interface UserData {
    socket: Socket;
    username: string;
    id: number;
}

export interface PlayerPosition {
    id: number;
    username: string;
    y: number;
    score: number;
}

export interface GamePosition {
    player1: PlayerPosition;
    player2: PlayerPosition;
}
