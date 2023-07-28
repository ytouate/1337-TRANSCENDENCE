import { useRef, useEffect, useState } from "react";
import {
    PlayerPosition,
    GameState,
    Player,
    Ball,
    Paddle,
} from "../../interface/game.ts";
import {
    drawBall,
    drawGameOver,
    drawNet,
    drawPaddle,
    drawScores,
    initBall,
    initPref,
} from "../../pages/AgainstAi/gameUtils.ts";
import {
    BALL_SIZE_RATIO,
    PADDLE_HEIGHT_RATIO,
    PADDLE_MARGIN_RATIO,
    PADDLE_WIDTH_RATIO,
} from "../../constants/constants.ts";
import EndGameScreen from "../EndGameScreen/EndGameScreen.tsx";
import webSocketService from "../../context/WebSocketService.ts";
import "./Game.css";
import { Spectate } from "../Spectate/Spectate.tsx";

interface Props {
    player1: Player;
    player2: Player;
    gameId: number;
    userId: number;
    resetState: (() => void) | null;
    isSpectate: boolean;
}

const Game = ({
    userId,
    player1,
    player2,
    gameId,
    resetState,
    isSpectate,
}: Props) => {
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
        drawNet(context, player1.paddle.color);
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
                player1.preferences.paddleColor
            );
        } else {
            drawScores(
                context,
                player2.score,
                player1.score,
                player2.username,
                player1.username,
                player1.preferences.paddleColor
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
            return;
        }

        socket.on("game_over", (result: { winnerData: PlayerPosition }) => {
            const playerPosition = result.winnerData;

            if (playerPosition.username === player1.username) {
                player1.score = playerPosition.score;
            } else {
                player2.score = playerPosition.score;
            }

            // draw(context);
            setGameOver(true);
        });

        socket.on("game_update", (state: GameState) => {
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

            if (isSpectate || state.gamePosition.player1.id == userId) {
                playerPos1 = state.gamePosition.player1;
                playerPos2 = state.gamePosition.player2;
            } else {
                playerPos1 = state.gamePosition.player2;
                playerPos2 = state.gamePosition.player1;
            }

            player1.score = playerPos1.score;
            player2.score = playerPos2.score;

            const actualPosition1 = playerPos1.y * canvas.height;
            const actualPosition2 = playerPos2.y * canvas.height;

            if (isSpectate) player1.paddle.y = actualPosition1;
            player2.paddle.y = actualPosition2;
        });

        return () => {
            socket.off("game_update");
            socket.off("game_over");
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        let animationFrameId: number;

        let prevCanvasWidth = canvas.width;
        let prevCanvasHeight = canvas.height;

        const handleMouseMove = (event: MouseEvent) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;
            if (!gameOver) {
                player1.paddle.y = mouseY - paddleHeight / 2;
                webSocketService.getSocket()?.emit("mouseMove", {
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
                    context.canvas.height
                );
                drawNet(context, player1.preferences.paddleColor);
                drawScores(
                    context,
                    player1.score,
                    player2.score,
                    player1.username,
                    player2.username,
                    player1.preferences.paddleColor
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

        if (!isSpectate) canvas.addEventListener("mousemove", handleMouseMove);

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

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            if (!isSpectate)
                canvas.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [draw]);

    const getLeftPlayer = () => {
        // if (isSpectate) return player1;
        if (player1.order === 0) return player1;
        else return player2;
    };
    const getRightPlayer = () => {
        // if (isSpectate) return player2;

        if (player2.order === 0) return player1;
        else return player2;
    };

    return (
        <div className="canvas-container">
            <canvas ref={canvasRef} className="canvas" />
            {gameOver && (
                <div className="endgame-overlay"
                    style={{  backgroundColor: '#28235c',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',}}>
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
