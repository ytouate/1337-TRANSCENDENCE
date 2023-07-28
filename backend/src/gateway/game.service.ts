import {
    OnModuleInit,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
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
import {
    UserData,
    GamePosition,
    PlayerPosition,
    Lobby,
} from './gamelogic/interfaces';
import { Game } from './gamelogic/Game';
import { GameService } from 'src/game/game.service';
import { UserSettingsService } from 'src/usersettings/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'game', cors: true })
@UseGuards(AuthGuard('websocket-jwt'))
export class GameGateWay implements OnGatewayConnection {
    userSockets: Map<number, UserData>;
    queue: number[];
    gamePlayerPosition: Map<number, GamePosition>;
    challengeLobby: Map<number, Lobby>;

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
        this.challengeLobby = new Map();
    }

    // called when a client is connected
    async handleConnection(@ConnectedSocket() client: Socket) {
        // console.log('handleConnection');
        const payload = await this.jwtSerive.verifyAsync(
            client.handshake.headers.authorization.slice(7),
        );
        this.addClient(client, payload.email);
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
        // console.log('handleDisconnect');

        this.removeClient(client);
    }

    // add client to the userSockets
    async addClient(client: Socket, email: string) {
        const user = await this.userService.getUserByEmail(email);

        if (!user) return null;

        const userData: UserData = {
            socket: client,
            username: user.username,
            id: user.id,
            // pref: user.preference,
        };

        //means player exists
        // console.log(`Client with username ${user.username} connected`);
        // console.log({ connected_client: userData });

        this.userSockets.set(user.id, userData);
        return user;
    }

    clearMaps(gameInvite: boolean, roomId: number, player1: number) {
        this.gamePlayerPosition.delete(roomId);
        if (gameInvite) {
            this.challengeLobby.delete(player1);
        }
    }

    // match two players and start the game
    async matchPlayers(
        player1: number,
        player2: number,
        gameInvite: boolean,
        req: any,
    ) {
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
            eventName: event_name,
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
            eventName: event_name,
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

        this.userService.updatePlayerStatus(player1, 'INGAME');
        this.userService.updatePlayerStatus(player2, 'INGAME');

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

        gameInstance.startGameLoop(this.server, () => {
            this.clearMaps(gameInvite, game.id, player1);
            this.userService.updatePlayerStatus(player1, 'ONLINE');
            this.userService.updatePlayerStatus(player2, 'ONLINE');
        }, event_name);
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
        eventName?: String
    ): { gameId: number; p: PlayerPosition } | undefined {
        for (const [gameId, gamePosition] of this.gamePlayerPosition) {
            for (let p of gamePosition.players) {
                if (p.id === userId && (!eventName || p.eventName === eventName)) return { gameId, p };
            }
        }
        return undefined;
    }

    // event handler, used when players queue up
    @SubscribeMessage('queueUp')
    async queueUp(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
        @Req() req,
    ) {
        const payload = await this.jwtSerive.verifyAsync(
            client.handshake.headers.authorization.slice(7),
        );

        console.log('queue up');

        const user = await this.addClient(client, payload.email);

        if (this.queue.includes(user.id)) {
            console.log('User already in the queue');
            return;
        }

        let privateLobbyGame = this.checkifPlayerInGame(user.id, 'game_invite_start');
        if (privateLobbyGame) {
            client.emit('already_private_game');
            return ;
        }


        let matchMadeGame = this.checkifPlayerInGame(user.id, 'match_found');
        if (matchMadeGame) {
          console.log('player already in game');

            client.emit('match_found', {
                gameId: matchMadeGame.gameId,
                opponent: matchMadeGame.p.opponent,
                order: matchMadeGame.p.order,
                pref: matchMadeGame.p.pref,
                pref2: matchMadeGame.p.pref2,
                urlImg1: matchMadeGame.p.urlImg1,
                urlImg2: matchMadeGame.p.urlImg2,
            });

            const roomId = String(matchMadeGame.gameId);
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
            this.matchPlayers(player1, player2, false, req);
        } else {
            // console.log('nope');
        }
    }

    @SubscribeMessage('cancelInvite')
    cancelInvite(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
        const userId: number = body.userId;
        const lobby = this.challengeLobby.get(userId);
        if (lobby) {
            const invitee = lobby.inviteeId;
            this.challengeLobby.delete(userId);
            const userData = this.userSockets.get(invitee);
            if (userData)
                this.server
                    .to(userData.socket.id)
                    .emit('invitation_canceled', { challengerId: userId });
        }
    }

    // event to handle players' invite
    @SubscribeMessage('gameInvite')
    async gameInvite(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {
        // const payload = await this.jwtSerive.verifyAsync(
        //     client.handshake.headers.authorization.slice(7),
        // );
        const userId: number = body.userId;
        const friendId: number = body.friendId;
        // const user = await this.addClient(client, payload.username);
        const user = this.userSockets.get(userId);

        const myData = this.userSockets.get(userId);
        if (!myData) return;

        // the player u challenging already challenged you
        for (const [id, lobby] of this.challengeLobby) {
            if (lobby.inviteeId === userId && lobby.users[0]?.id === friendId) {
                console.log('already challenged');
                myData.socket.emit('already_challenged', {
                    challengerId: lobby.users[0].id,
                });
                return;
            } else if (
                lobby.users[0]?.id == userId ||
                lobby.users[1]?.id === userId
            ) {
                console.log('u already in ...');
                return;
            }
        }


        const friendData = this.userSockets.get(friendId);
        if (!friendData) {
            console.log('friend not connected'); // the socket is not at least..
            return;
        }

   
        if (friendData.id === myData.id) {
            console.log('inviting userself ?');
            return;
        }

        const lobby: Lobby = {
            inviteeId: friendData.id,
            users: new Array(2).fill(null),
        };

        // console.log('invite ' + userId);
        this.challengeLobby.set(userId, lobby);

        myData.socket.emit('invite_sent', {
            username: friendData.username,
            id: myData.id,
        });

        myData.socket.to(friendData.socket.id).emit('receive_invite', {
            title: 'Request',
            type: 'game_invite',
            description: `${myData.username} challenged u to a game`,
            id: myData.id,
            username: myData.username,
            status: false,
        });
    }

    // event handler, when the player responds to an invite from another player
    @SubscribeMessage('declineInvitation')
    inviteResponse(@MessageBody() body: any) {
        const userId: number = body.userId;
        const hostId: number = body.hostId;

        const myData = this.userSockets.get(userId);
        const opponentData = this.userSockets.get(hostId);
        this.challengeLobby.delete(hostId);
        if (myData && opponentData) {
            opponentData.socket.emit('invite_declined', {
                userId: userId,
                hostId: hostId,
                username: myData.username,
                status: 'declined',
            });

            opponentData.socket.emit('notif_invite_declined', {
                senderInfo: opponentData.id,
                title: 'Info',
                type: 'game_invite',
                description: `${opponentData.username} has declined your invitation`,
                id: opponentData.id,
                status: false,
                username: opponentData.username,
            });
        }
    }

    @SubscribeMessage('playerReady')
    playerReady(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
        @Req() req,
    ) {
        console.log('player ready');
        const hostId: number = body.hostId;
        const userId: number = body.userId;

        const myData = this.userSockets.get(userId);

        const lobby = this.challengeLobby.get(hostId);

        if (!lobby || (userId != lobby.inviteeId && userId != hostId)) {
            console.log('u are not allowed here');
            myData?.socket.emit('unauthorized_lobby', {});
            // throw new UnauthorizedException();
            //
            return;
        }
        // if game already started
        if (lobby.users[0]?.id === userId || lobby.users[1]?.id === userId) {
            console.log('already in game');
            myData?.socket.emit('unauthorized_lobby', {});

            return;
        }
        let check = this.checkifPlayerInGame(userId, null);
        if (check) {
            console.log('finish ur game first');
            myData?.socket.emit('unauthorized_lobby', {});
            return ;
        }
        if (hostId === userId) lobby.users[0] = myData;
        else lobby.users[1] = myData;

        if (lobby.users[0] && lobby.users[1]) {
            //emit to both players to play
            this.matchPlayers(lobby.users[0].id, lobby.users[1].id, true, req);
            // this.challengeLobby.delete(hostId);
        }
    }

    @SubscribeMessage('spectateGame')
    async spectateGame(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {
        const gameId: number = body.gameId;
        const gamePosition = this.gamePlayerPosition.get(Number(gameId));
        // console.log(gamePosition);
        // console.log(gameId);
        if (gamePosition) {
            const roomId = String(gameId);

            client.emit('spectate_ready', {
                gameId: gameId,
                player1: gamePosition.players[0],
                player2: gamePosition.players[1],
            });

            client.join(roomId);
        } else {
            client.emit('lobby_not_found');
        }
    }
}
