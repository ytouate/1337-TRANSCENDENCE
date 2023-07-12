import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserData, GamePosition, PlayerPosition } from './gamelogic/interfaces';
import { GameService } from 'src/game/game.service';
import { PrefService } from 'src/pref/pref.service';
import { UserSettingsService } from 'src/usersettings/user.service';
export declare class GameGateWay implements OnGatewayConnection, OnModuleInit {
    private userService;
    private gameService;
    private prefService;
    userSockets: Map<number, UserData>;
    queue: number[];
    gamePlayerPosition: Map<number, GamePosition>;
    server: Server;
    constructor(userService: UserSettingsService, gameService: GameService, prefService: PrefService);
    onModuleInit(): void;
    handleConnection(client: Socket): Promise<void>;
    getUserIdBySocket(socket: Socket): number | undefined;
    removeClient(client: Socket): void;
    handleDisconnect(client: Socket): void;
    addClient(client: Socket): Promise<void>;
    matchPlayers(player1: number, player2: number, gameInvite: boolean): Promise<void>;
    mouseMove(body: any, client: Socket): void;
    checkifPlayerInGame(userId: number): {
        gameId: number;
        p: PlayerPosition;
    } | undefined;
    queueUp(body: any, client: Socket): Promise<void>;
    gameInvite(body: any): Promise<void>;
    inviteResponse(body: any): Promise<void>;
}
