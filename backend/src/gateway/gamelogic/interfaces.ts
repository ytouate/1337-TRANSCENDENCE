import { Preference } from '@prisma/client';
import { Socket } from 'socket.io';

export interface UserData {
    socket: Socket;
    username: string;
    id: number;
}

export interface PlayerPosition {
    id: number;
    username: string;
    opponent: string
    y: number;
    score: number;
    order: number;
    pref: Preference;
    pref2: Preference;
}

export interface GamePosition {
    players: PlayerPosition[];
}

export interface Ball {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
}
