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
import { PrismaService } from 'src/prisma/prisma.service';

export class Game {
    private roomId: number;
    private socket1: Socket;
    private socket2: Socket;
    private gamePosition: GamePosition;
    private timeStart: Date;

    constructor(
        roomId: number,
        socket1: Socket,
        socket2: Socket,
        gamePosition: GamePosition,
        timeStart: Date,
    ) {
        this.roomId = roomId;
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.gamePosition = gamePosition;
        this.timeStart = timeStart;
    }

    public startGameLoop(server: Server, prisma: PrismaService) {
        var ball: Ball = {
            x: BOARD_WIDTH / 2,
            y: BOARD_HEIGHT / 2,
            speedX: BALL_SPEED_X,
            speedY: BALL_SPEED_Y,
        };

        const interval = setInterval(() => {
            // const gamePosition = this.gamePlayerPosition.get(roomId);

            ball.x += ball.speedX;
            ball.y += ball.speedY;

            var { reset } = this.gameLogic(ball, this.gamePosition);

            if (reset) {
                ball.speedY = BALL_SPEED_Y;
                var { data, gameOver } = this.checkScore(
                    ball,
                    this.gamePosition,
                );
                if (gameOver) {
                    server.to(String(this.roomId)).emit('game_over', {
                        data,
                    });
                    this.updateGameEnd(prisma, data.id);
                    this.socket1.leave(String(this.roomId));
                    this.socket2.leave(String(this.roomId));
                    clearInterval(interval); // Stop the interval

                    return;
                }
                this.resetBall(ball);
            }

            server.to(String(this.roomId)).emit('game_update', {
                ball: { x: ball.x, y: ball.y },
                gamePosition: this.gamePosition,
            });
        }, 1000 / 60);
    }

    private gameLogic(ball: Ball, gamePosition: GamePosition) {
        var reset = false;
        if (ball.x < PADDLE_MARGIN + BALL_SIZE + PADDLE_WIDTH) {
            if (
                ball.y > gamePosition.player1.y &&
                ball.y < gamePosition.player1.y + PADDLE_HEIGHT
            ) {
                ball.speedX *= -1;
                var deltaY =
                    ball.y -
                    (gamePosition.player1.y + PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.35;
            } else if (ball.x < 0) {
                gamePosition.player2.score++;
                reset = true;
            }
        } else if (
            ball.x >
            BOARD_WIDTH - BALL_SIZE - PADDLE_WIDTH - PADDLE_MARGIN
        ) {
            if (
                ball.y > gamePosition.player2.y &&
                ball.y < gamePosition.player2.y + PADDLE_HEIGHT
            ) {
                ball.speedX *= -1;
                var deltaY =
                    ball.y -
                    (gamePosition.player2.y + PADDLE_HEIGHT / 2);
                ball.speedY = deltaY * 0.35;
            } else if (ball.x > BOARD_WIDTH) {
                gamePosition.player1.score++;
                reset = true;
            }
        }

        if (ball.y < 0) {
            ball.speedY *= -1;
        }
        if (ball.y > BOARD_HEIGHT) {
            ball.speedY *= -1;
        }
        return { reset };
    }

    private resetBall(ball: Ball) {
        ball.x = BOARD_WIDTH / 2;
        ball.y = BOARD_HEIGHT / 2;
        ball.speedX *= -1; // flip direction
    }

    private checkScore(ball: Ball, gamePosition: GamePosition) {
        ball.speedY = BALL_SPEED_Y;
        var data: PlayerPosition;
        var gameOver;
        if (gamePosition.player1.score >= WIN_CONDITION) {
            gameOver = true;
            data = gamePosition.player1;
        }
        if (gamePosition.player2.score >= WIN_CONDITION) {
            gameOver = true;
            data = gamePosition.player2;
        }
        return { gameOver, data };
    }

    private async updateGameEnd(prisma: PrismaService, id: number) {
        const durationInSeconds = Math.floor(
            (new Date().getTime() -
                new Date(this.timeStart).getTime()) /
                1000,
        );
        try {
            await prisma.game.update({
                where: {
                    id: this.roomId,
                },
                data: {
                    status: 'FINISHED',
                    score1: this.gamePosition.player1.score,
                    score2: this.gamePosition.player2.score,
                    winnerId: id,
                    duration: durationInSeconds,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
