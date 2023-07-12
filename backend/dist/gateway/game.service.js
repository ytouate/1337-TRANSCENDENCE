"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateWay = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const constants_1 = require("./gamelogic/constants");
const Game_1 = require("./gamelogic/Game");
const game_service_1 = require("../game/game.service");
const pref_service_1 = require("../pref/pref.service");
const user_service_1 = require("../usersettings/user.service");
let GameGateWay = class GameGateWay {
    constructor(userService, gameService, prefService) {
        this.userService = userService;
        this.gameService = gameService;
        this.prefService = prefService;
        this.userSockets = new Map();
        this.queue = [];
        this.gamePlayerPosition = new Map();
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
        });
    }
    async handleConnection(client) {
        this.addClient(client);
    }
    getUserIdBySocket(socket) {
        for (const [userId, userData] of this.userSockets) {
            if (userData.socket.id === socket.id) {
                return userId;
            }
        }
        return undefined;
    }
    removeClient(client) {
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
    handleDisconnect(client) {
        this.removeClient(client);
    }
    async addClient(client) {
        const { userId } = client.handshake.query;
        const user = await this.userService.getUserById(Number(userId));
        if (!user)
            return;
        const userData = {
            socket: client,
            username: user.username,
            id: user.id,
        };
        console.log(`Client with userId ${userId} connected`);
        this.userSockets.set(user.id, userData);
    }
    async matchPlayers(player1, player2, gameInvite) {
        const userData1 = this.userSockets.get(player1);
        const userData2 = this.userSockets.get(player2);
        if (!userData1 || !userData2)
            return;
        if (!userData1.socket || !userData2.socket)
            return;
        const game = await this.gameService.createGame({
            player1,
            player2,
        });
        if (!game)
            throw new Error('Failed to create the game');
        const roomId = String(game.id);
        console.log('Joining Room:', roomId);
        userData1.socket.join(roomId);
        userData2.socket.join(roomId);
        console.log('emitting to user 1:');
        console.log('emitting to user 2:');
        const event_name = gameInvite
            ? 'game_invite_start'
            : 'match_found';
        const pref1 = await this.prefService.getUserPref(userData1.id);
        const pref2 = await this.prefService.getUserPref(userData2.id);
        userData1.socket.emit(event_name, {
            gameId: game.id,
            opponent: userData2.username,
            order: 0,
            pref: pref1,
            pref2: pref2,
        });
        userData2.socket.emit(event_name, {
            gameId: game.id,
            opponent: userData1.username,
            order: 1,
            pref: pref2,
            pref2: pref1,
        });
        const players = new Array(2);
        players[0] = {
            id: userData1.id,
            username: userData1.username,
            opponent: userData2.username,
            y: constants_1.BOARD_HEIGHT / 2 - constants_1.PADDLE_HEIGHT / 2,
            score: 0,
            order: 0,
            pref: pref1,
            pref2: pref2,
        };
        players[1] = {
            id: userData2.id,
            username: userData2.username,
            opponent: userData1.username,
            y: constants_1.BOARD_HEIGHT / 2 - constants_1.PADDLE_HEIGHT / 2,
            score: 0,
            order: 1,
            pref: pref2,
            pref2: pref1,
        };
        this.gamePlayerPosition.set(game.id, { players });
        const gamePosition = this.gamePlayerPosition.get(game.id);
        const gameInstance = new Game_1.Game(game.id, userData1.socket, userData2.socket, gamePosition, game.createdAt, this.gameService, this.userService);
        gameInstance.startGameLoop(this.server, this.gamePlayerPosition);
    }
    mouseMove(body, client) {
        const { y, gameId, userId, order } = body;
        const gamePositions = this.gamePlayerPosition.get(gameId);
        if (gamePositions) {
            gamePositions.players[order].y = y * constants_1.BOARD_HEIGHT;
            const roomId = String(gameId);
            client.broadcast
                .to(roomId)
                .emit('opponent_mousemove', { y });
        }
    }
    checkifPlayerInGame(userId) {
        for (const [gameId, gamePosition] of this
            .gamePlayerPosition) {
            for (let p of gamePosition.players) {
                if (p.id === userId)
                    return { gameId, p };
            }
        }
        return undefined;
    }
    async queueUp(body, client) {
        const userId = body.userId;
        if (this.queue.includes(userId)) {
            console.log('User already in the queue');
            return;
        }
        let check = this.checkifPlayerInGame(userId);
        if (check) {
            client.emit('match_found', {
                gameId: check.gameId,
                opponent: check.p.opponent,
                order: check.p.order,
                pref: check.p.pref,
                pref2: check.p.pref2,
            });
            const roomId = String(check.gameId);
            client.join(roomId);
            return;
        }
        this.queue.push(userId);
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.matchPlayers(player1, player2, false);
        }
    }
    async gameInvite(body) {
        const userId = body.userId;
        const opponentUsername = body.opponentUsername;
        const opponent = await this.userService.getUserByUsername(opponentUsername);
        if (!opponent) {
            console.log('opponent not found');
            return;
        }
        const opponentData = this.userSockets.get(opponent.id);
        if (!opponentData)
            return;
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
    async inviteResponse(body) {
        const userId = body.userId;
        const opponentId = body.opponentId;
        const status = body.status;
        if (status === 'accepted') {
            console.log('players matched');
            await new Promise(() => {
                setTimeout(() => {
                    this.matchPlayers(opponentId, userId, true);
                }, 1000);
            });
        }
        else if (status === 'declined') {
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
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateWay.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GameGateWay.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateWay.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mouseMove'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateWay.prototype, "mouseMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('queueUp'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GameGateWay.prototype, "queueUp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('gameInvite'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateWay.prototype, "gameInvite", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('inviteResponse'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameGateWay.prototype, "inviteResponse", null);
GameGateWay = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [user_service_1.UserSettingsService,
        game_service_1.GameService,
        pref_service_1.PrefService])
], GameGateWay);
exports.GameGateWay = GameGateWay;
//# sourceMappingURL=game.service.js.map