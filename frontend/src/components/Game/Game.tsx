import { useRef, useEffect, useState } from 'react';
import {
    PlayerPosition,
    GameState,
    Player,
    Ball,
    Paddle,
} from '../../interface/game.ts';
import {
    drawBall,
    drawGameOver,
    drawNet,
    drawPaddle,
    drawScores,
    initBall,
    initPref,
} from '../../pages/AgainstAi/gameUtils.ts';
import {
    BALL_SIZE_RATIO,
    PADDLE_HEIGHT_RATIO,
    PADDLE_MARGIN_RATIO,
    PADDLE_WIDTH_RATIO,
} from '../../constants/constants.ts';
import EndGameScreen from '../EndGameScreen/EndGameScreen.tsx';
import webSocketService from '../../context/WebSocketService.ts';
import './Game.css';

interface Props {
    player1: Player;
    player2: Player;
    gameId: any;
    userId: number;
    resetState: (() => void) | null;
}

const Game = ({ userId, player1, player2, gameId, resetState }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameOver, setGameOver] = useState(false);

    let paddleMargin = 0;
    let paddleWidth = 0;
    let paddleHeight = 0;

    let ball: Ball = initBall();

    if (!player1.preferences) {
        player1.preferences = initPref();
    }

    if (!player2.preferences) {
        player2.preferences = initPref();
    }

    const draw = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawNet(context, 'white');
        drawPaddle(context, player1.paddle, paddleWidth, paddleHeight);
        drawPaddle(context, player2.paddle, paddleWidth, paddleHeight);
        drawBall(context, ball, player1.preferences.ballColor);
        if (player1.order === 0) {
            drawScores(
                context,
                player1.score,
                player2.score,
                player1.username,
                player2.username,
            );
        } else {
            drawScores(
                context,
                player2.score,
                player1.score,
                player2.username,
                player1.username,
            );
        }
    };

    useEffect(() => {
        // const container = canvasRef.current?.parentElement;
        // if (container) {
        //     ball.x = container.clientWidth / 2;
        //     ball.x = container.clientHeight / 2;
        // }

        const socket = webSocketService.getSocket();
        if (!socket) {
            console.log('no socket');
            return;
        }

        socket.on('game_over', (result: { winnerData: PlayerPosition }) => {
            // console.log(result);
            const playerPosition = result.winnerData;
            if (playerPosition.id === userId) {
                console.log('U won');

                player1.score = playerPosition.score;
            } else {
                console.log('U lost');
                player2.score = playerPosition.score;
            }
            // draw(context);
            setGameOver(true);
        });

        socket.on('game_update', (state: GameState) => {
            // setGameBall(state.ball);

            const canvas = canvasRef.current;
            if (!canvas) return;

            const sBall = state.ball;

            ball.x = sBall.x * canvas.width;
            ball.y = sBall.y * canvas.height;
            ball.speedX = sBall.speedX * canvas.width;
            ball.speedY = sBall.speedY * canvas.height;
            // ball.velocity = sBall.velocity;
            // ball.delta = sBall.delta;

            let playerPos1: PlayerPosition;
            let playerPos2: PlayerPosition;

            if (state.gamePosition.player1.id == userId) {
                playerPos1 = state.gamePosition.player1;
                playerPos2 = state.gamePosition.player2;
            } else {
                playerPos1 = state.gamePosition.player2;
                playerPos2 = state.gamePosition.player1;
            }

            player1.score = playerPos1.score;
            player2.score = playerPos2.score;

            const actualPosition = playerPos2.y * canvas.height;
            player2.paddle.y = actualPosition;
        });

        return () => {
            socket.off('game_update');
            socket.off('game_over');
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        let animationFrameId: number;

        let prevCanvasWidth = canvas.width;
        let prevCanvasHeight = canvas.height;

        const handleMouseOver = (event: MouseEvent) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;
            if (!gameOver) {
                player1.paddle.y = mouseY - paddleHeight / 2;
                webSocketService.getSocket()?.emit('mouseMove', {
                    userId: userId,
                    gameId: gameId,
                    y: player1.paddle.y / canvas.height,
                    order: player1.order,
                });
            }
        };

        const render = (time: number) => {
            if (gameOver) {
                context.clearRect(
                    0,
                    0,
                    context.canvas.width,
                    context.canvas.height,
                );
                drawNet(context, 'white');
                drawScores(
                    context,
                    player1.score,
                    player2.score,
                    player1.username,
                    player2.username,
                );
                drawGameOver(context);
                return;
            }
            // applyMoves(context);
            // use this for predection
            // if (
            //     ball.y - ball.size <= 0 ||
            //     ball.y + ball.size >= canvas.height
            // ) {
            //     ball.speedY *= -1;
            // }
            // ball.x += ball.speedX;
            // ball.y += ball.speedY;
            draw(context);
            animationFrameId = window.requestAnimationFrame(render);
        };
        animationFrameId = window.requestAnimationFrame(render);

        canvas.addEventListener('mousemove', handleMouseOver);

        const resizeCanvas = () => {
            const container = canvasRef.current?.parentElement;
            if (!container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            paddleMargin = canvas.width * PADDLE_MARGIN_RATIO;
            paddleWidth = canvas.height * PADDLE_WIDTH_RATIO;
            paddleHeight = canvas.height * PADDLE_HEIGHT_RATIO;
            ball.size = canvas.height * BALL_SIZE_RATIO;

            ball.x = (ball.x / prevCanvasWidth) * canvas.width;
            ball.y = (ball.y / prevCanvasHeight) * canvas.height;

            prevCanvasWidth = canvas.width;
            prevCanvasHeight = canvas.height;

            player1.paddle.y = canvas.height / 2 - paddleHeight / 2;
            player2.paddle.y = canvas.height / 2 - paddleHeight / 2;

            if (player1.order === 0) {
                player1.paddle.x = paddleMargin;
                player2.paddle.x = canvas.width - paddleWidth - paddleMargin;
            } else {
                player2.paddle.x = paddleMargin;
                player1.paddle.x = canvas.width - paddleWidth - paddleMargin;
            }
            const heightRatio = canvas.height / prevCanvasHeight;
            player1.paddle.y *= heightRatio;
            player2.paddle.y *= heightRatio;
            if (gameOver) drawGameOver(context);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseOver);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [draw]);

    const getLeftPlayer = () => {
        if (player1.order === 0) return player1;
        else return player2;
    };
    const getRightPlayer = () => {
        if (player2.order === 0) return player1;
        else return player2;
    };

    return (
        <div className='canvas-container'>
            <canvas ref={canvasRef} className='canvas' />
            {gameOver && (
                <div className='endgame-overlay'>
                    <EndGameScreen
                        username1={getLeftPlayer().username}
                        score1={getLeftPlayer().score}
                        score2={getRightPlayer().score}
                        username2={getRightPlayer().username}
                        resetState={resetState}
                        urlImage1={getLeftPlayer().urlImg}
                        urlImage2={getRightPlayer().urlImg}
                    />
                </div>
            )}
        </div>
    );
};

export default Game;
