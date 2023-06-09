import { OnModuleInit, Req } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from 'src/game/game.service';
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
import { UserData, PlayerPosition, GamePosition } from './interfaces';

@WebSocketGateway({ cors: true })
export class GameGateWay
    implements OnGatewayConnection, OnModuleInit
{
    userSockets: Map<number, UserData>;
    queue: number[];
    gamePlayerPosition: Map<number, GamePosition>;

    @WebSocketServer()
    server: Server;

    constructor(
        private prisma: PrismaService,
        private gameService: GameService,
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

    async handleConnection(@ConnectedSocket() client: Socket) {
        this.addClient(client);
    }

    getUserIdBySocket(socket: Socket): number | undefined {
        for (const [userId, userData] of this.userSockets) {
            if (userData.socket.id === socket.id) {
                return userId;
            }
        }
        return undefined;
    }

    removeClient(client: Socket) {
        const userId = this.getUserIdBySocket(client);

        if (userId) {
            this.userSockets.delete(userId);
            const index = this.queue.findIndex(
                (element) => element === userId,
            );
            if (index !== -1) {
                this.queue.splice(index, 1);
            }
            console.log(`Client with userId ${userId} disconnected`);
        }
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.removeClient(client);
    }

    async addClient(client: Socket) {
        const { userId } = client.handshake.query;

        const user = await this.prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
        });

        const userData: UserData = {
            socket: client,
            username: user.username,
            id: user.id,
        };

        //means player exists and belongs to the lobby
        if (!this.userSockets.has(user.id)) {
            console.log(`Client with userId ${userId} connected`);

            this.userSockets.set(user.id, userData);
        }
    }

    async matchPlayers(player1: number, player2: number) {
        // Get the sockets for the matched players
        const userData1 = this.userSockets.get(player1);
        const userData2 = this.userSockets.get(player2);

        const game = await this.gameService.createGame({
            player1: player1,
            player2: player2,
        });

        if (!game) throw new Error('Failed to create the game');

        const roomId = String(game.id);
        console.log('Joining Room:', roomId);

        if (userData1) userData1.socket.join(roomId);
        if (userData2) userData2.socket.join(roomId);

        if (!userData1 || !userData2) return;

        if (!userData1.socket || !userData2.socket) return;

        userData1.socket.emit('match_found', {
            gameId: game.id,
            opponent: userData2.username,
            pos: 'left',
        });

        userData2.socket.emit('match_found', {
            gameId: game.id,
            opponent: userData1.username,
            pos: 'right',
        });

        this.gamePlayerPosition.set(game.id, {
            player1: {
                id: userData1.id,
                username: userData1.username,
                y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
                score: 0,
            },
            player2: {
                id: userData2.id,
                username: userData2.username,
                y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
                score: 0,
            },
        });

        // this.userSockets.delete(player1); // still dont know what to do with this
        // this.userSockets.delete(player2);

        this.startGameLoop(
            game.id,
            userData1.socket,
            userData2.socket,
        );
    }

    startGameLoop(roomId: number, socket1: Socket, socket2: Socket) {
        var ball = {
            x: BOARD_WIDTH / 2,
            y: BOARD_HEIGHT / 2,
            speedX: BALL_SPEED_X,
            speedY: BALL_SPEED_Y,
        };

        const interval = setInterval(() => {
            const gamePosition = this.gamePlayerPosition.get(roomId);

            ball.x += ball.speedX;
            ball.y += ball.speedY;

            var reset = false;
            var gameOver = false;

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

            if (reset) {
                var data: PlayerPosition;
                if (gamePosition.player1.score >= WIN_CONDITION) {
                    gameOver = true;
                    data = gamePosition.player1;
                }
                if (gamePosition.player2.score >= WIN_CONDITION) {
                    gameOver = true;
                    data = gamePosition.player2;
                }
                if (gameOver) {
                    this.server.to(String(roomId)).emit('game_over', {
                        data,
                    });
                    this.updateGameEnd(roomId, gamePosition);
                    socket1.leave(String(roomId));
                    socket2.leave(String(roomId));
                    clearInterval(interval); // Stop the interval

                    return;
                }
                ball.x = BOARD_WIDTH / 2;
                ball.y = BOARD_HEIGHT / 2;
                ball.speedX *= -1; // flip direction
            }

            this.server.to(String(roomId)).emit('game_update', {
                ball: { x: ball.x, y: ball.y },
                gamePosition,
            });
        }, 1000 / 60);
    }

    updateGameEnd(gameId: number, gamePosition: GamePosition) {
        try {
            this.prisma.game.update({
                where: {
                    id: gameId,
                },
                data: {
                    status: 'FINISHED',
                    score1: gamePosition.player1.score,
                    score2: gamePosition.player2.score,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    //will use later
    // updateGameScores(gameId: number, gamePosition: GamePosition) {
    //     try {
    //         this.prisma.game.update({
    //             where: {
    //                 id: gameId,
    //             },
    //             data: {
    //                 score1: gamePosition.player1.score,
    //                 score2: gamePosition.player2.score,
    //             },
    //         });
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    @SubscribeMessage('mouseMove')
    mouseMove(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ) {
        const { y, gameId, userId } = body;
        // const userId = this.getUserIdBySocket(client);

        const gamePositions = this.gamePlayerPosition.get(gameId);
        if (gamePositions) {
            if (userId == gamePositions.player1.id) {
                gamePositions.player1.y = y;
            } else if (userId == gamePositions.player2.id) {
                gamePositions.player2.y = y;
            }
        }
    }

    @SubscribeMessage('queueUp')
    async queueUp(@MessageBody() body: any) {
        const userId = body.userId;

        // console.log({ userId });

        // if (!this.userSockets.has(userId)) return;

        this.queue.push(userId);
        // console.log({ id: userId, len: this.queue.length });
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            this.matchPlayers(player1, player2);
        }
    }
}
