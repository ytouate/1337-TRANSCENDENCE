import { Preference } from '@prisma/client';
import { Socket } from 'socket.io';

export interface UserData {
    socket: Socket;
    username: string;
    id: number;
}

export interface Lobby {
    inviteeId: number
    users: UserData[];
}

export interface PlayerPosition {
    eventName: string;
    id: number;
    username: string;
    opponent: string;
    y: number;
    score: number;
    order: number;
    pref: Preference;
    pref2: Preference;
    urlImg1: String;
    urlImg2: String;
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
