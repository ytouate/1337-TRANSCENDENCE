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
} from './constants';
import { PlayerPosition, GamePosition, Ball } from './interfaces';
import { GameService } from 'src/game/game.service';
import { UserService } from 'src/user/user.service';

export class Game {
    private roomId: number;
    private socket1: Socket;
    private socket2: Socket;
    private gamePosition: GamePosition;
    private timeStart: Date;
    private round: number;
    private gameService: GameService;
    private userService: UserService;

    constructor(
        roomId: number,
        socket1: Socket,
        socket2: Socket,
        gamePosition: GamePosition,
        timeStart: Date,
        gameService: GameService,
        userService: UserService,
    ) {
        this.roomId = roomId;
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.gamePosition = gamePosition;
        this.timeStart = timeStart;
        this.round = 0;
        this.gameService = gameService;
        this.userService = userService;
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

        const interval = setInterval(() => {
            server.to(room).emit('game_update', {
                ball: {
                    x: ball.x / BOARD_WIDTH,
                    y: ball.y / BOARD_HEIGHT,
                    speedX: ball.speedX / BOARD_WIDTH,
                    speedY: ball.speedY / BOARD_HEIGHT,
                },
                gamePosition: {
                    player1: {
                        id: this.gamePosition.player1.id,
                        y: this.gamePosition.player1.y / BOARD_HEIGHT,
                        username: this.gamePosition.player1.username,
                        score: this.gamePosition.player1.score,
                    },
                    player2: {
                        id: this.gamePosition.player2.id,
                        y: this.gamePosition.player2.y / BOARD_HEIGHT,
                        username: this.gamePosition.player2.username,
                        score: this.gamePosition.player2.score,
                    },
                },
            });

            ball.x += ball.speedX;
            ball.y += ball.speedY;

            let { reset } = this.gameLogic(ball, this.gamePosition);

            if (reset) {
                let { winnerData, loserData, gameOver } =
                    this.checkScore(ball, this.gamePosition);

                if (gameOver) {
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

    private gameLogic(ball: Ball, gamePosition: GamePosition) {
        let reset = false;
        const { player1, player2 } = gamePosition;

        if (ball.x <= PADDLE_MARGIN + BALL_SIZE + PADDLE_WIDTH) {
            if (ball.x < 0) {
                player2.score++;
                reset = true;
            } else if (
                ball.y + BALL_SIZE >= player1.y &&
                ball.y - BALL_SIZE <= player1.y + PADDLE_HEIGHT
            ) {
                ball.speedX *= -1;
                let deltaY = ball.y - (player1.y + PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.35;
            }
        } else if (
            ball.x >=
            BOARD_WIDTH - BALL_SIZE - PADDLE_WIDTH - PADDLE_MARGIN
        ) {
            if (ball.x >= BOARD_WIDTH) {
                player1.score++;
                reset = true;
            } else if (
                ball.y + BALL_SIZE >= player2.y &&
                ball.y - BALL_SIZE <= player2.y + PADDLE_HEIGHT
            ) {
                ball.speedX *= -1;

                let deltaY = ball.y - (player2.y + PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.35;
            }
        }
        if (
            ball.y - BALL_SIZE <= 0 ||
            ball.y + BALL_SIZE >= BOARD_HEIGHT
        ) {
            ball.speedY *= -1;
        }
        return { reset };
    }

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

    private checkScore(ball: Ball, gamePosition: GamePosition) {
        let winnerData: PlayerPosition;
        let loserData: PlayerPosition;
        let gameOver;
        if (gamePosition.player1.score >= WIN_CONDITION) {
            gameOver = true;
            winnerData = gamePosition.player1;
            loserData = gamePosition.player2;
        }
        if (gamePosition.player2.score >= WIN_CONDITION) {
            gameOver = true;
            winnerData = gamePosition.player2;
            loserData = gamePosition.player1;
        }
        return { gameOver, winnerData, loserData };
    }

    // private async updateGameScore(
    //     prisma: PrismaService,
    //     id: number,
    //     score1: number,
    //     score2: number,
    // ) {

    // }

    private async updateGameEnd(winnerId: number, loserId: number) {
        const durationInSeconds = Math.floor(
            (new Date().getTime() -
                new Date(this.timeStart).getTime()) /
                1000,
        );
        try {
            await this.gameService.updateGameEnd(
                this.roomId,
                this.gamePosition.player1.score,
                this.gamePosition.player2.score,
                winnerId,
                durationInSeconds,
            );

            await this.userService.updateUserWin(winnerId);
            await this.userService.updateUserLoss(loserId);
        } catch (error) {
            throw error;
        }
    }
}
