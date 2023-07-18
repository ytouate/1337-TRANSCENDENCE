import { useRef, useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import galaxy_black from '../../assets/space_black.jpeg';
import galaxy_pink from '../../assets/galaxy_pink.png';
import jungle from '../../assets/jungle.jpeg';
import {
    BALL_SIZE_RATIO,
    INITIAL_VELOCITY,
    PADDLE_HEIGHT_RATIO,
    PADDLE_MARGIN_RATIO,
    PADDLE_WIDTH_RATIO,
    VELOCITY_INCREASE,
} from '../../constants/constants.ts';
import {
    PADDLE_COLOR,
    BALL_COLOR,
    WIN_CONDITION,
    BALL_SPEED_X,
    BALL_SPEED_Y,
} from '../../constants/constants.ts';
import {
    computerMovement,
    drawBall,
    drawNet,
    drawPaddle,
    drawScores,
} from './gameUtils.ts';
import { Ball, Button, Paddle, Preferences } from '../../interface/game.ts';
import './AgainstAi.css';
import EndGameScreen from '../../components/EndGameScreen/EndGameScreen.tsx';

const AgainstAi = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const lastTime = useRef<number>(0);

    const user: any = useLoaderData();

    let { preference } = user;
    console.log(user);

    if (!preference) {
        // Create a new prefs object with default values
        const newPrefs: any = {
            paddleColor: PADDLE_COLOR,
            ballColor: BALL_COLOR,
            mapTheme: 'grey',
        };

        preference = newPrefs;
    }

    let velocity = INITIAL_VELOCITY;

    let paddleMargin = 0;
    let paddleWidth = 0;
    let paddleHeight = 0;

    let paddle1: Paddle = {
        x: 0,
        y: 0,
        color: preference.paddleColor,
    };

    let paddle2: Paddle = {
        x: 0,
        y: 0,
        color: PADDLE_COLOR,
    };

    let ball: Ball = {
        x: 0,
        y: 0,
        speedX: BALL_SPEED_X,
        speedY: BALL_SPEED_Y,
        size: 0,
    };

    const resetState = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        setScore1(0);
        setScore2(0);
        lastTime.current = 0;

        velocity = INITIAL_VELOCITY;
        ball.x = canvas.width / 2;
        ball.y = canvas.width / 2;
        paddle2.y = canvas.height / 2 - paddleHeight / 2;
        setGameOver(false);
    };

    const ballReset = (
        score1: number,
        score2: number,
        canvas: HTMLCanvasElement,
    ) => {
        velocity = INITIAL_VELOCITY;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        if (ball.speedX < 0) ball.speedX = BALL_SPEED_X;
        else ball.speedX = -BALL_SPEED_X;
        ball.speedY = (Math.random() < 0.5 ? -1 : 1) * BALL_SPEED_Y;
        if (score1 >= WIN_CONDITION || score2 >= WIN_CONDITION) {
            setGameOver(true);
        }
    };

    const applyMoves = (canvas: HTMLCanvasElement, delta: number) => {
        if (gameOver) return;
        computerMovement(paddle2, ball, paddleHeight, delta, canvas);
        ball.x += ball.speedX * velocity * delta;
        ball.y += ball.speedY * velocity * delta;
        velocity += VELOCITY_INCREASE * delta;

        if (ball.x <= paddleMargin + ball.size + paddleWidth) {
            if (
                ball.y + ball.size >= paddle1.y &&
                ball.y - ball.size <= paddle1.y + paddleHeight
            ) {
                ball.x += 10;
                ball.speedX *= -1;
                let deltaY = ball.y - (paddle1.y + paddleHeight / 2);
                ball.speedY = deltaY * 0.22;
            } else if (ball.x + ball.size <= 0) {
                let score = score2 + 1;
                setScore2(score);
                ballReset(score1, score, canvas);
            }
        } else if (
            ball.x >=
            canvas.width - ball.size - paddleWidth - paddleMargin
        ) {
            if (
                ball.y + ball.size >= paddle2.y &&
                ball.y - ball.size <= paddle2.y + paddleHeight
            ) {
                ball.x -= 10;
                ball.speedX *= -1;
                let deltaY = ball.y - (paddle2.y + paddleHeight / 2);
                ball.speedY = deltaY * 0.22;
            } else if (ball.x - ball.size >= canvas.width) {
                let score = score1 + 1;
                setScore1(score);
                ballReset(score, score2, canvas);
            }
        }
        if (ball.y - ball.size < 0) {
            ball.speedY *= -1;
            ball.y += 10;
        } else if (ball.y + ball.size > canvas.height) {
            ball.speedY *= -1;
            ball.y -= 10;
        }
    };

    const drawGameOver = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.lineWidth = 4;
        drawNet(context, 'black');
    };

    const draw = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawNet(context, 'white');
        drawPaddle(context, paddle1, paddleWidth, paddleHeight);
        drawPaddle(context, paddle2, paddleWidth, paddleHeight);
        drawBall(context, ball, preference.ballColor);
        drawScores(context, score1, score2, 'me', 'AI');
    };

    useEffect(() => {
        console.log('start');
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        let animationFrameId: number;

        let prevCanvasWidth = canvas.width;
        let prevCanvasHeight = canvas.height;

        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;

        paddle1.y = canvas.height / 2 - paddleHeight / 2;

        const handleMouseMove = (event: MouseEvent) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;
            paddle1.y = mouseY - paddleHeight / 2;
        };

        const render = (time: number) => {
            if (lastTime.current === 0) {
                lastTime.current = time;
                animationFrameId = window.requestAnimationFrame(render);
                return;
            }
            const delta = time - lastTime.current;
            lastTime.current = time;

            if (gameOver) {
                context.clearRect(
                    0,
                    0,
                    context.canvas.width,
                    context.canvas.height,
                );
                drawNet(context, 'white');
                drawScores(context, score1, score2, 'ME', 'AI');
                drawGameOver(context);
                return;
            }
            applyMoves(canvas, delta);
            draw(context);
            animationFrameId = window.requestAnimationFrame(render);
        };

        animationFrameId = window.requestAnimationFrame(render);

        canvas.addEventListener('mousemove', handleMouseMove);

        const resizeCanvas = () => {
            const container = canvasRef.current?.parentElement;
            if (!container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            paddleMargin = canvas.width * PADDLE_MARGIN_RATIO;
            paddleWidth = canvas.height * PADDLE_WIDTH_RATIO;
            paddleHeight = canvas.height * PADDLE_HEIGHT_RATIO;
            ball.size = Math.min(canvas.width, canvas.height) * BALL_SIZE_RATIO;

            ball.x = (ball.x / prevCanvasWidth) * canvas.width;
            ball.y = (ball.y / prevCanvasHeight) * canvas.height;

            prevCanvasWidth = canvas.width;
            prevCanvasHeight = canvas.height;

            paddle1.x = paddleMargin;
            paddle1.y = canvas.height / 2 - paddleHeight / 2;
            paddle2.x = canvas.width - paddleWidth - paddleMargin;
            paddle2.y = canvas.height / 2 - paddleHeight / 2;
            if (gameOver) drawGameOver(context);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [draw]);

    const getMap = () => {
        const map = preference.mapTheme;
        if (map === 'jungle')
            return {
                backgroundImage: `url(${jungle})`,
                backgroundSize: 'cover',
            };
        else if (map === 'galaxy_pink')
            return {
                backgroundImage: `url(${galaxy_pink})`,
                backgroundSize: 'cover',
            };
        else if (map === 'galaxy_black')
            return {
                backgroundImage: `url(${galaxy_black})`,
                backgroundSize: 'cover',
            };
        else
            return {
                backgroundColor: map,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
    };

    return (
        <div className='canvas-container'>
            <canvas
                ref={canvasRef}
                style={{ ...getMap() }}
                className={`canvas ${
                    gameOver ? 'cursor-none' : 'cursor-default'
                }`}
            />
            {gameOver && (
                <div className='endgame-overlay'>
                    <EndGameScreen
                        username1={user.username}
                        score1={score1}
                        score2={score2}
                        username2='BOT'
                        resetState={() => resetState(canvasRef.current)}
                        urlImage1={user.urlImage}
                        urlImage2=''
                    />
                </div>
            )}
        </div>
    );
};

export default AgainstAi;
