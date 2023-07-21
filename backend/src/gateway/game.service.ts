import { OnModuleInit, Req, UseGuards } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BOARD_HEIGHT, PADDLE_HEIGHT } from './gamelogic/constants';
import { UserData, GamePosition, PlayerPosition } from './gamelogic/interfaces';
import { Game } from './gamelogic/Game';
import { GameService } from 'src/game/game.service';
import { UserSettingsService } from 'src/usersettings/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'game', cors: true })
@UseGuards(AuthGuard('websocket-jwt'))
export class GameGateWay implements OnGatewayConnection, OnModuleInit {
    userSockets: Map<number, UserData>;
    queue: number[];
    gamePlayerPosition: Map<number, GamePosition>;

    @WebSocketServer()
    server: Server;

    constructor(
        private userService: UserSettingsService,
        private gameService: GameService,
        // private prefService: PrefService,
        private jwtSerive: JwtService,
    ) {
        this.userSockets = new Map<number, UserData>();
        this.queue = [];
        this.gamePlayerPosition = new Map();
    }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log(socket.id);
        });
    }

    // called when a client is connected
    async handleConnection(@ConnectedSocket() client: Socket) {
        // const payload = await this.jwtSerive.verifyAsync(
        //     client.handshake.headers.authorization.slice(7),
        // );
        // this.addClient(client, 'mkorchi');
    }

    getUserIdBySocket(socket: Socket): number | undefined {
        for (const [userId, userData] of this.userSockets) {
            if (userData.socket.id === socket.id) {
                return userId;
            }
        }
        return undefined;
    }

    // remove a client from the userSockets and queue
    removeClient(client: Socket) {
        const userId = this.getUserIdBySocket(client);

        if (userId) {
            this.userSockets.delete(userId);
            const index = this.queue.findIndex((element) => element === userId);
            if (index !== -1) {
                this.queue.splice(index, 1);
            }
            console.log(`Client with userId ${userId} disconnected`);
        }
    }

    // called when a client disconnects
    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.removeClient(client);
    }

    // add client to the userSockets
    async addClient(client: Socket, username: string) {
        const user = await this.userService.getUserByUsername(username);

        if (!user) return null;

        const userData: UserData = {
            socket: client,
            username: user.username,
            id: user.id,
            // pref: user.preference,
        };

        //means player exists
        console.log(`Client with username ${username} connected`);

        this.userSockets.set(user.id, userData);
        return user;
    }

    // match two players and start the game
    async matchPlayers(player1: number, player2: number, gameInvite: boolean) {
        // Get the sockets for the matched players
        const userData1 = this.userSockets.get(player1);
        const userData2 = this.userSockets.get(player2);

        if (!userData1 || !userData2) return;

        if (!userData1.socket || !userData2.socket) return;

        const game = await this.gameService.createGame({
            player1,
            player2,
        });

        if (!game) throw new Error('Failed to create the game');

        const roomId = String(game.id);
        console.log('Joining Room:', roomId);

        // join the players to a room
        userData1.socket.join(roomId);
        userData2.socket.join(roomId);

        console.log('emitting to user 1:');

        console.log('emitting to user 2:');

        const event_name = gameInvite ? 'game_invite_start' : 'match_found';

        // const pref1 = await this.prefService.getUserPref(userData1.id);
        // const pref2 = await this.prefService.getUserPref(userData2.id);

        const user1 = await this.userService.getUserById(userData1.id);
        const user2 = await this.userService.getUserById(userData2.id);

        userData1.socket.emit(event_name, {
            gameId: game.id,
            opponent: userData2.username,
            order: 0,
            pref: user1.preference,
            pref2: user2.preference,
            urlImg1: user1.urlImage,
            urlImg2: user2.urlImage,
        });

        userData2.socket.emit(event_name, {
            gameId: game.id,
            opponent: userData1.username,
            order: 1,
            pref: user2.preference,
            pref2: user1.preference,
            urlImg1: user2.urlImage,
            urlImg2: user1.urlImage,
        });

        const players: PlayerPosition[] = new Array(2);

        players[0] = {
            id: userData1.id,
            username: userData1.username,
            opponent: userData2.username,
            y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            score: 0,
            order: 0,
            pref: user1.preference,
            pref2: user2.preference,
            urlImg1: user1.urlImage,
            urlImg2: user2.urlImage,
        };

        players[1] = {
            id: userData2.id,
            username: userData2.username,
            opponent: userData1.username,
            y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            score: 0,
            order: 1,
            pref: user2.preference,
            pref2: user1.preference,
            urlImg1: user2.urlImage,
            urlImg2: user1.urlImage,
        };

        this.gamePlayerPosition.set(game.id, { players });

        const gamePosition = this.gamePlayerPosition.get(game.id);

        // Create a new Game instance and start the game loop
        const gameInstance = new Game(
            game.id,
            userData1.socket,
            userData2.socket,
            gamePosition,
            game.createdAt,
            this.gameService,
            this.userService,
        );
        gameInstance.startGameLoop(this.server, this.gamePlayerPosition);
    }

    // event handler so each player ..
    // emit their mouse movement to the server
    @SubscribeMessage('mouseMove')
    mouseMove(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
        const { y, gameId, userId, order } = body;

        const gamePositions = this.gamePlayerPosition.get(gameId);
        if (gamePositions) {
            gamePositions.players[order].y = y * BOARD_HEIGHT;
        }
    }

    // Check if a player is already in a game
    checkifPlayerInGame(
        userId: number,
    ): { gameId: number; p: PlayerPosition } | undefined {
        for (const [gameId, gamePosition] of this.gamePlayerPosition) {
            for (let p of gamePosition.players) {
                if (p.id === userId) return { gameId, p };
            }
        }
        return undefined;
    }

    // event handler, used when players queue up
    @SubscribeMessage('queueUp')
    async queueUp(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
        const payload = await this.jwtSerive.verifyAsync(
            client.handshake.headers.authorization.slice(7),
        );
        const user = await this.addClient(client, payload.username);

        console.log('queue up');

        if (this.queue.includes(user.id)) {
            console.log('User already in the queue');
            return;
        }

        let check = this.checkifPlayerInGame(user.id);
        if (check) {
            client.emit('match_found', {
                gameId: check.gameId,
                opponent: check.p.opponent,
                order: check.p.order,
                pref: check.p.pref,
                pref2: check.p.pref2,
                urlImg1: check.p.urlImg1,
                urlImg2: check.p.urlImg2,
            });

            const roomId = String(check.gameId);
            client.join(roomId);

            return;
        }
        this.queue.push(user.id);
        // if more than 2 players in the queue,
        // take the oldest ones in the queue and match them
        if (this.queue.length >= 2) {
            console.log('queue already 2 ');
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.matchPlayers(player1, player2, false);
        } else {
            // console.log('nope');
        }
    }

    // event to handle players' invite
    @SubscribeMessage('gameInvite')
    async gameInvite(@MessageBody() body: any) {
        const userId: number = body.userId;
        const opponentUsername: string = body.opponentUsername;

        const opponent = await this.userService.getUserByUsername(
            opponentUsername,
        );
        if (!opponent) {
            console.log('opponent not found');
            return;
        }

        const opponentData = this.userSockets.get(opponent.id);
        if (!opponentData) return;
        const myData = this.userSockets.get(userId);
        if (opponentData.id === myData.id) {
            console.log('inviting userself retard ?');
            return;
        }

        const senderInfo = await this.userService.getUserById(userId);

        if (!senderInfo) {
            console.log('huh u dont exist');
            return;
        }

        myData.socket.to(opponentData.socket.id).emit('invite', {
            senderInfo: senderInfo,
        });
    }

    // event handler, when the player responds to an invite from another player
    @SubscribeMessage('inviteResponse')
    async inviteResponse(@MessageBody() body: any) {
        const userId: number = body.userId;
        const opponentId: number = body.opponentId;
        const status: string = body.status;

        // if the invitee accepts, match the two players
        // else sends a feedback to the inviter that the player declined
        if (status === 'accepted') {
            console.log('players matched');
            await new Promise(() => {
                setTimeout(() => {
                    this.matchPlayers(opponentId, userId, true);
                }, 1000);
            });
        } else if (status === 'declined') {
            console.log('player declined');
            const myData = this.userSockets.get(userId);
            const opponentData = this.userSockets.get(opponentId);
            if (myData) {
                myData.socket
                    .to(opponentData.socket.id)
                    .emit('invite_response', {
                        userId: userId,
                        username: myData.username,
                        status: 'declined',
                    });
            }
        }
    }

    @SubscribeMessage('spectateGame')
    async spectateGame(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {
        const gameId: number = body.gameId;

        const gamePosition = this.gamePlayerPosition.get(gameId);
        if (gamePosition) {
            const roomId = String(gameId);

            this.server.to(client.id).emit('spectate_ready', {
                gameId: gameId,
                player1: gamePosition.players[0],
                player2: gamePosition.players[1],
            });

            client.join(roomId);
        }
    }
}
