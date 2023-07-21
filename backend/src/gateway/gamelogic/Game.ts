import { Socket, Server } from 'socket.io';
import {
    WIN_CONDITION,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    BALL_SIZE,
    BALL_SPEED_X,
    BALL_SPEED_Y,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_MARGIN,
    INITIAL_VELOCITY,
    VELOCITY_INCREASE,
} from './constants';
import { PlayerPosition, GamePosition, Ball } from './interfaces';
import { GameService } from 'src/game/game.service';
import { UserSettingsService } from 'src/usersettings/user.service';

export class Game {
    private roomId: number;
    private socket1: Socket;
    private socket2: Socket;
    private gamePosition: GamePosition;
    private timeStart: Date;
    private round: number;
    private gameService: GameService;
    private userService: UserSettingsService;
    private velocity: number;

    constructor(
        roomId: number,
        socket1: Socket,
        socket2: Socket,
        gamePosition: GamePosition,
        timeStart: Date,
        gameService: GameService,
        userService: UserSettingsService,
    ) {
        this.roomId = roomId;
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.gamePosition = gamePosition;
        this.timeStart = timeStart;
        this.round = 0;
        this.gameService = gameService;
        this.userService = userService;
        this.velocity = INITIAL_VELOCITY;
    }

    public startGameLoop(
        server: Server,
        gamePlayerPosition: Map<number, GamePosition>,
    ) {
        let ball: Ball = {
            x: BOARD_WIDTH / 2,
            y: BOARD_HEIGHT / 2,
            speedX: BALL_SPEED_X,
            speedY: BALL_SPEED_Y,
        };

        const room = String(this.roomId);

        let last = performance.now();
        const interval = setInterval(() => {
            const now = performance.now();
            const delta = now - last;
            last = now;

            const players: PlayerPosition[] = new Array(2);

            players[0] = {
                id: this.gamePosition.players[0].id,
                y: this.gamePosition.players[0].y / BOARD_HEIGHT,
                username: this.gamePosition.players[0].username,
                opponent: this.gamePosition.players[0].opponent,
                score: this.gamePosition.players[0].score,
                order: this.gamePosition.players[0].order,
                pref: this.gamePosition.players[0].pref,
                pref2: this.gamePosition.players[0].pref,
                urlImg1: this.gamePosition.players[0].urlImg1,
                urlImg2: this.gamePosition.players[0].urlImg2,
            };
            players[1] = {
                id: this.gamePosition.players[1].id,
                y: this.gamePosition.players[1].y / BOARD_HEIGHT,
                username: this.gamePosition.players[1].username,
                opponent: this.gamePosition.players[1].opponent,
                score: this.gamePosition.players[1].score,
                order: this.gamePosition.players[1].order,
                pref: this.gamePosition.players[1].pref,
                pref2: this.gamePosition.players[1].pref,
                urlImg1: this.gamePosition.players[1].urlImg1,
                urlImg2: this.gamePosition.players[1].urlImg2,
            };
            server.to(room).emit('game_update', {
                ball: {
                    x: ball.x / BOARD_WIDTH,
                    y: ball.y / BOARD_HEIGHT,
                    speedX: (ball.speedX * this.velocity * delta) / BOARD_WIDTH,
                    speedY:
                        (ball.speedY * this.velocity * delta) / BOARD_HEIGHT,
                },
                gamePosition: {
                    player1: players[0],
                    player2: players[1],
                },
            });

            // updating the ball position
            ball.x += ball.speedX * this.velocity * delta;
            ball.y += ball.speedY * this.velocity * delta;
            this.velocity += VELOCITY_INCREASE * delta;

            let { reset } = this.gameLogic(ball, this.gamePosition, delta);

            if (reset) {
                this.velocity = INITIAL_VELOCITY;
                let { winnerData, loserData, gameOver } = this.checkScore(
                    ball,
                    this.gamePosition,
                );

                if (gameOver) {
                    // emit to players that the game is over, and some data about the game
                    server.to(room).emit('game_over', {
                        winnerData,
                    });
                    this.updateGameEnd(winnerData.id, loserData.id);
                    this.socket1.leave(String(this.roomId));
                    this.socket2.leave(String(this.roomId));
                    gamePlayerPosition.delete(this.roomId);

                    clearInterval(interval); // Stop the interval
                    return;
                }
                this.resetBall(ball);
            }
        }, 1000 / 60);
    }

    // game logic for ball collision, update scores, update speed/direction of the ball
    private gameLogic(ball: Ball, gamePosition: GamePosition, delta: number) {
        let reset = false;
        const { players } = gamePosition;

        if (ball.x <= PADDLE_MARGIN + BALL_SIZE + PADDLE_WIDTH) {
            if (
                ball.y + BALL_SIZE >= players[0].y &&
                ball.y - BALL_SIZE <= players[0].y + PADDLE_HEIGHT
            ) {
                ball.x += 10;
                ball.speedX *= -1;
                let deltaY = ball.y - (players[0].y + PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.22;
            } else if (ball.x + BALL_SIZE <= 0) {
                players[1].score++;
                reset = true;
            }
        } else if (
            ball.x >=
            BOARD_WIDTH - BALL_SIZE - PADDLE_WIDTH - PADDLE_MARGIN
        ) {
            if (
                ball.y + BALL_SIZE >= players[1].y &&
                ball.y - BALL_SIZE <= players[1].y + PADDLE_HEIGHT
            ) {
                ball.x -= 10;
                ball.speedX *= -1;
                let deltaY = ball.y - (players[1].y + PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.22;
            } else if (ball.x - BALL_SIZE >= BOARD_WIDTH) {
                players[0].score++;
                reset = true;
            }
        }
        if (ball.y - BALL_SIZE <= 0) {
            ball.speedY *= -1;
            ball.y += 10;
        } else if (ball.y + BALL_SIZE >= BOARD_HEIGHT) {
            ball.speedY *= -1;
            ball.y -= 10;
        }
        return { reset };
    }

    // Reset the ball position and speed for a new round
    private resetBall(ball: Ball) {
        this.round++;
        ball.x = BOARD_WIDTH / 2;
        ball.y = BOARD_HEIGHT / 2;
        if (this.round % 2 === 0) {
            ball.speedX = BALL_SPEED_X;
        } else {
            ball.speedX = -BALL_SPEED_X;
        }
        ball.speedY = (Math.random() < 0.5 ? -1 : 1) * BALL_SPEED_Y;
    }

    // check if a player has reached the winning condition
    private checkScore(ball: Ball, gamePosition: GamePosition) {
        let winnerData: PlayerPosition;
        let loserData: PlayerPosition;
        let gameOver;
        if (gamePosition.players[0].score >= WIN_CONDITION) {
            gameOver = true;
            winnerData = gamePosition.players[0];
            loserData = gamePosition.players[1];
        }
        if (gamePosition.players[1].score >= WIN_CONDITION) {
            gameOver = true;
            winnerData = gamePosition.players[1];
            loserData = gamePosition.players[0];
        }
        return { gameOver, winnerData, loserData };
    }

    // update game and data and user statistics
    private async updateGameEnd(winnerId: number, loserId: number) {
        const durationInSeconds = Math.floor(
            (new Date().getTime() - new Date(this.timeStart).getTime()) / 1000,
        );
        try {
            const updatedGame = await this.gameService.updateGameEnd(
                this.roomId,
                this.gamePosition.players[0].score,
                this.gamePosition.players[1].score,
                winnerId,
                durationInSeconds,
            );
            if (updatedGame.players[0].id === winnerId) {
                await this.userService.updateUserWin(
                    winnerId,
                    updatedGame.players[0],
                );
                await this.userService.updateUserLoss(
                    loserId,
                    updatedGame.players[1],
                );
            } else {
                await this.userService.updateUserWin(
                    winnerId,
                    updatedGame.players[1],
                );
                await this.userService.updateUserLoss(
                    loserId,
                    updatedGame.players[0],
                );
            }
        } catch (error) {
            throw error;
        }
    }
}
