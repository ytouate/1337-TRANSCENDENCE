"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const constants_1 = require("./constants");
class Game {
    constructor(roomId, socket1, socket2, gamePosition, timeStart, gameService, userService) {
        this.roomId = roomId;
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.gamePosition = gamePosition;
        this.timeStart = timeStart;
        this.round = 0;
        this.gameService = gameService;
        this.userService = userService;
        this.velocity = constants_1.INITIAL_VELOCITY;
    }
    startGameLoop(server, gamePlayerPosition) {
        let ball = {
            x: constants_1.BOARD_WIDTH / 2,
            y: constants_1.BOARD_HEIGHT / 2,
            speedX: constants_1.BALL_SPEED_X,
            speedY: constants_1.BALL_SPEED_Y,
        };
        const room = String(this.roomId);
        let last = performance.now();
        const interval = setInterval(() => {
            const now = performance.now();
            const delta = now - last;
            last = now;
            const players = new Array(2);
            players[0] = {
                id: this.gamePosition.players[0].id,
                y: this.gamePosition.players[0].y / constants_1.BOARD_HEIGHT,
                username: this.gamePosition.players[0].username,
                opponent: this.gamePosition.players[0].opponent,
                score: this.gamePosition.players[0].score,
                order: this.gamePosition.players[0].order,
                pref: this.gamePosition.players[0].pref,
                pref2: this.gamePosition.players[0].pref,
            };
            players[1] = {
                id: this.gamePosition.players[1].id,
                y: this.gamePosition.players[1].y / constants_1.BOARD_HEIGHT,
                username: this.gamePosition.players[1].username,
                opponent: this.gamePosition.players[1].opponent,
                score: this.gamePosition.players[1].score,
                order: this.gamePosition.players[1].order,
                pref: this.gamePosition.players[1].pref,
                pref2: this.gamePosition.players[1].pref,
            };
            server.to(room).emit('game_update', {
                ball: {
                    x: ball.x / constants_1.BOARD_WIDTH,
                    y: ball.y / constants_1.BOARD_HEIGHT,
                    speedX: (ball.speedX * this.velocity * delta) /
                        constants_1.BOARD_WIDTH,
                    speedY: (ball.speedY * this.velocity * delta) /
                        constants_1.BOARD_HEIGHT,
                },
                gamePosition: {
                    player1: players[0],
                    player2: players[1],
                },
            });
            ball.x += ball.speedX * this.velocity * delta;
            ball.y += ball.speedY * this.velocity * delta;
            this.velocity += constants_1.VELOCITY_INCREASE * delta;
            let { reset } = this.gameLogic(ball, this.gamePosition, delta);
            if (reset) {
                this.velocity = constants_1.INITIAL_VELOCITY;
                let { winnerData, loserData, gameOver } = this.checkScore(ball, this.gamePosition);
                if (gameOver) {
                    server.to(room).emit('game_over', {
                        winnerData,
                    });
                    this.updateGameEnd(winnerData.id, loserData.id);
                    this.socket1.leave(String(this.roomId));
                    this.socket2.leave(String(this.roomId));
                    gamePlayerPosition.delete(this.roomId);
                    clearInterval(interval);
                    return;
                }
                this.resetBall(ball);
            }
        }, 1000 / 60);
    }
    gameLogic(ball, gamePosition, delta) {
        let reset = false;
        const { players } = gamePosition;
        if (ball.x <= constants_1.PADDLE_MARGIN + constants_1.BALL_SIZE + constants_1.PADDLE_WIDTH) {
            if (ball.y + constants_1.BALL_SIZE >= players[0].y &&
                ball.y - constants_1.BALL_SIZE <= players[0].y + constants_1.PADDLE_HEIGHT) {
                ball.speedX *= -1;
                let deltaY = ball.y - (players[0].y + constants_1.PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.22;
            }
            else if (ball.x - constants_1.BALL_SIZE <= 0) {
                players[1].score++;
                reset = true;
            }
        }
        else if (ball.x >=
            constants_1.BOARD_WIDTH - constants_1.BALL_SIZE - constants_1.PADDLE_WIDTH - constants_1.PADDLE_MARGIN) {
            if (ball.y + constants_1.BALL_SIZE >= players[1].y &&
                ball.y - constants_1.BALL_SIZE <= players[1].y + constants_1.PADDLE_HEIGHT) {
                ball.speedX *= -1;
                let deltaY = ball.y - (players[1].y + constants_1.PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.22;
            }
            else if (ball.x + constants_1.BALL_SIZE >= constants_1.BOARD_WIDTH) {
                players[0].score++;
                reset = true;
            }
        }
        if (ball.y - constants_1.BALL_SIZE <= 0) {
            ball.speedY *= -1;
            ball.y += 10;
        }
        else if (ball.y + constants_1.BALL_SIZE >= constants_1.BOARD_HEIGHT) {
            ball.speedY *= -1;
            ball.y -= 10;
        }
        return { reset };
    }
    resetBall(ball) {
        this.round++;
        ball.x = constants_1.BOARD_WIDTH / 2;
        ball.y = constants_1.BOARD_HEIGHT / 2;
        if (this.round % 2 === 0) {
            ball.speedX = constants_1.BALL_SPEED_X;
        }
        else {
            ball.speedX = -constants_1.BALL_SPEED_X;
        }
        ball.speedY = (Math.random() < 0.5 ? -1 : 1) * constants_1.BALL_SPEED_Y;
    }
    checkScore(ball, gamePosition) {
        let winnerData;
        let loserData;
        let gameOver;
        if (gamePosition.players[0].score >= constants_1.WIN_CONDITION) {
            gameOver = true;
            winnerData = gamePosition.players[0];
            loserData = gamePosition.players[1];
        }
        if (gamePosition.players[1].score >= constants_1.WIN_CONDITION) {
            gameOver = true;
            winnerData = gamePosition.players[1];
            loserData = gamePosition.players[0];
        }
        return { gameOver, winnerData, loserData };
    }
    async updateGameEnd(winnerId, loserId) {
        const durationInSeconds = Math.floor((new Date().getTime() -
            new Date(this.timeStart).getTime()) /
            1000);
        try {
            await this.gameService.updateGameEnd(this.roomId, this.gamePosition.players[0].score, this.gamePosition.players[1].score, winnerId, durationInSeconds);
            await this.userService.updateUserWin(winnerId);
            await this.userService.updateUserLoss(loserId);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map