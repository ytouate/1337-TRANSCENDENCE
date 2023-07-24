import {
    BALL_COLOR,
    BALL_SPEED_X,
    BALL_SPEED_Y,
    PADDLE_COLOR,
} from '../../constants/constants.ts';
import { Ball, Button, Paddle } from '../../interface/game.ts';

export const drawPaddle = (
    context: CanvasRenderingContext2D,
    paddle: Paddle,
    width: number,
    height: number,
) => {
    context.fillStyle = paddle.color;
    context.fillRect(paddle.x, paddle.y, width, height);
};

export const drawBall = (
    context: CanvasRenderingContext2D,
    ball: Ball,
    color: string,
) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
};

export const drawNet = (context: CanvasRenderingContext2D, color: string) => {
    const netSpacing = 40;
    const netWidth = 6;
    const netHeight = 20;
    const centerX = context.canvas.width / 2 - netWidth / 2;
    for (let i = 0; i < context.canvas.height; i += netSpacing) {
        context.fillStyle = color;
        context.fillRect(centerX, i, netWidth, netHeight);
    }
};

export const fillText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    size: number,
    color: string,
) => {
    const fontSize = size;
    context.fillStyle = color;
    context.font = `${fontSize}px 'Roboto', sans-serif`;
    context.textAlign = 'center';

    context.fillText(text, x, y);
};

export const drawButton = (
    context: CanvasRenderingContext2D,
    button: Button,
    text: string,
    color: string,
    size: number,
    fill: boolean,
) => {
    const canvasHeight = context.canvas.height;
    const canvasWidth = context.canvas.width;
    const buttonHeight = button.height;
    const buttonWidth = button.width;
    const buttonX = button.x;
    const buttonY = button.y;

    if (fill) {
        context.fillStyle = color;
        context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        color = 'black';
    } else {
        context.strokeStyle = color;
        context.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    }
    const textSize = size;
    const textY = buttonY + buttonHeight / 2 + textSize / 3; // Calculate text y position
    // fillText(
    //     context,
    //     text,
    //     button.x + button.width / 2,
    //     button.y + button.height / 2 + 8,
    //     textSize,
    //     color,
    // );
    fillText(context, text, buttonX + buttonWidth / 2, textY, textSize, color);
};

export const computerMovement = (
    paddle: Paddle,
    ball: Ball,
    height: number,
    deltaTime: number,
    canvas: HTMLCanvasElement,
) => {
    const paddleYCenter = paddle.y + height / 2;
    const ballYCenter = ball.y + ball.size;
    // Calculate the offset based on the ball's vertical speed to improve difficulty
    const verticalSpeedOffset = ball.speedY * deltaTime * 0.5;

    // Update the paddle's target position with an additional offset
    const targetPaddleYCenter = ballYCenter + verticalSpeedOffset;

    // Smoothly move the paddle towards the target position
    const maxPaddleSpeed = 8; // lower this for easier difficulty
    const paddleSpeed = Math.min(
        Math.abs(targetPaddleYCenter - paddleYCenter),
        maxPaddleSpeed,
    );
    if (targetPaddleYCenter < paddleYCenter) {
        paddle.y -= paddleSpeed;
    } else if (targetPaddleYCenter > paddleYCenter) {
        paddle.y += paddleSpeed;
    }

    if (paddle.y < 0) {
        paddle.y = 0;
    } else if (paddle.y + height > canvas.height) {
        paddle.y = canvas.height - height;
    }
};

export const drawLeftGameOver = (
    context: CanvasRenderingContext2D,
    go_hover: boolean,
    home_hover: boolean,
    leftButton: Button,
    leftHomeButton: Button,
) => {
    fillText(
        context,
        'WIN',
        context.canvas.width / 4,
        context.canvas.height / 2 - 50,
        60,
        '#ffffff',
    );

    drawButton(context, leftButton, 'PLAY AGAIN', 'white', 30, go_hover);
    drawButton(context, leftHomeButton, 'HOME', 'white', 30, home_hover);
};

export const drawRightGameOver = (
    context: CanvasRenderingContext2D,
    go_hover: boolean,
    home_hover: boolean,
    rightButton: Button,
    rightHomeButton: Button,
) => {
    fillText(
        context,
        'WIN',
        (context.canvas.width * 3) / 4,
        context.canvas.height / 2 - 50,
        60,
        '#ffffff',
    );

    drawButton(context, rightButton, 'PLAY AGAIN', 'white', 30, go_hover);
    drawButton(context, rightHomeButton, 'HOME', 'white', 30, home_hover);
};

export const drawScores = (
    context: CanvasRenderingContext2D,
    score1: number,
    score2: number,
    player1: string,
    player2: string,
) => {
    // const player1Width = context.measureText(player1).width;
    // const player2Width = context.measureText(player2).width;
    // const fontSize = 24;
    // const playerHeight = fontSize + 5;

    // fillText(context, player1, 10, playerHeight, fontSize, 'white');
    // fillText(
    //     context,
    //     player2,
    //     context.canvas.width - player2Width - 10,
    //     playerHeight,
    //     fontSize,
    //     'white',
    // );
    fillText(
        context,
        score1.toString(),
        context.canvas.width / 2 - 75,
        75,
        70,
        'white',
    );
    fillText(
        context,
        score2.toString(),
        context.canvas.width / 2 + 75,
        75,
        70,
        'white',
    );
};

export const checkIfWithin = (
    mouseX: number,
    mouseY: number,
    button: Button,
    canvas: HTMLCanvasElement,
) => {
    const buttonX = button.x; // Adjust x position based on canvas width
    const buttonY = button.y; // Adjust y position based on canvas height
    const buttonWidth = button.width; // Adjust width based on canvas width
    const buttonHeight = button.height; // Adjust height based on canvas height

    return (
        mouseX >= buttonX &&
        mouseX <= buttonX + buttonWidth &&
        mouseY >= buttonY &&
        mouseY <= buttonY + buttonHeight
    );
};

export const initBall = (): Ball => {
    return { x: 0, y: 0, speedX: BALL_SPEED_X, speedY: BALL_SPEED_Y, size: 0 };
};

export const initPref = () => {
    return {
        paddleColor: PADDLE_COLOR,
        mapTheme: '',
        ballColor: BALL_COLOR,
    };
};

export const drawGameOver = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.lineWidth = 4;
    drawNet(context, 'gray');
};
