export interface PlayerPosition {
    id: number;
    username: string;
    y: number;
    score: number;
}

interface GamePosition {
    player1: PlayerPosition;
    player2: PlayerPosition;
}

export interface GameState {
    ball: Ball;
    gamePosition: GamePosition;
}

export interface Notif {
    userId: number;
    username: string;
}

export interface Button {
    x: number;
    y: number;
    height: number;
    width: number;
}

export interface Ball {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    size: number;
}

export interface Paddle {
    y: number;
    x: number;
    color: string;
}

export interface Player {
    paddle: Paddle;
    score: number;
    username: string;
    opponent: string;
    preferences: Preferences;
    order: number;
}

export interface Preferences {
    ballColor: string;
    paddleColor: string;
    mapTheme: string;
}
