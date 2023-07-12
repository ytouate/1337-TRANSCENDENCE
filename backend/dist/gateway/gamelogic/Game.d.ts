import { Socket, Server } from 'socket.io';
import { GamePosition } from './interfaces';
import { GameService } from 'src/game/game.service';
import { UserSettingsService } from 'src/usersettings/user.service';
export declare class Game {
    private roomId;
    private socket1;
    private socket2;
    private gamePosition;
    private timeStart;
    private round;
    private gameService;
    private userService;
    private velocity;
    constructor(roomId: number, socket1: Socket, socket2: Socket, gamePosition: GamePosition, timeStart: Date, gameService: GameService, userService: UserSettingsService);
    startGameLoop(server: Server, gamePlayerPosition: Map<number, GamePosition>): void;
    private gameLogic;
    private resetBall;
    private checkScore;
    private updateGameEnd;
}
