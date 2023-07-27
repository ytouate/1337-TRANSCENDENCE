import { useEffect, useState } from 'react';
// import Game from './Game';
import * as Constant from '../../constants/constants.ts';
import { useLoaderData } from 'react-router-dom';

// import webSocketService from '../service/WebSocketService.ts';
import { useNavigate } from 'react-router';
import { Paddle, Player } from '../../interface/game.ts';
// import { PacmanLoader } from 'react-spinners';
import galaxy_black from '../../assets/space_black.jpeg';
import galaxy_pink from '../../assets/galaxy_pink.png';
import jungle from '../../assets/jungle.jpeg';
import arcade from '../../assets/arcade.jpg';
import Game from '../../components/Game/Game.tsx';
import webSocketService from '../../context/WebSocketService.ts';
import './Queue.css';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation.tsx';

const Queue = () => {
    const user: any = useLoaderData();
    const { id, username, preference } = user;

    const [waitState, setWaitState] = useState(true);
    const [gameId, setGameId] = useState(null);
    const [player1, setPlayer1] = useState<Player>({} as Player);
    const [player2, setPlayer2] = useState<Player>({} as Player);
    const navigate = useNavigate();
    const [socket, setScoket] = useState<any>();

    let paddle1: Paddle = {
        x: Constant.PADDLE_MARGIN,
        y: window.innerHeight / 2 - Constant.PADDLE_HEIGHT / 2,
        color: Constant.PADDLE_COLOR,
    };

    let paddle2: Paddle = {
        x: window.innerWidth - Constant.PADDLE_WIDTH - Constant.PADDLE_MARGIN,
        y: window.innerHeight / 2 - Constant.PADDLE_HEIGHT / 2,
        color: Constant.PADDLE_COLOR,
    };

    const getMap = () => {
        const map = preference.mapTheme;
        if (map === 'jungle') return { backgroundImage: `url(${jungle})` };
        else if (map === 'galaxy_pink')
            return { backgroundImage: `url(${galaxy_pink})` };
        else if (map === 'galaxy_black')
            return { backgroundImage: `url(${galaxy_black})` };
        else if (map === 'arcade') return { backgroundImage: `url(${arcade})` };
        else
            return {
                backgroundColor: map,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
    };

    const resetState = () => {
        // const socket = webSocketService.getSocket();
        if (!socket) {
            navigate('/');
            return;
        }
        socket.emit('queueUp');
        setGameId(null);
        setWaitState(true);
    };

    useEffect(() => {
        setScoket(webSocketService.connect());
        // setScoket(webSocketService.getSocket());

        return () => {
            // webSocketService.disconnect();
            setScoket(null);
        };
    }, []);

    useEffect(() => {
        // const socket = webSocketService.getSocket();
        console.log('connected');

        if (!socket) {
            setScoket(webSocketService.connect());
        }

        socket?.emit('queueUp', { userId: id });

        // socket.on('disconnect', (reason: string) => {
        //     if (reason === 'io server disconnect') {
        //         return;
        //     }
        //     console.log(
        //         'Disconnected from the server. Attempting to reconnect...',
        //     );
        //     connectSocket();
        // });

        socket?.on('match_found', (data: any) => {
            console.log('match found');
            const { opponent, gameId, order, pref, pref2, urlImg1, urlImg2 } =
                data;

            console.log({ pref, pref2 });
            if (order === 0) {
                paddle1.color = pref.paddleColor;
                paddle2.color = pref2.paddleColor;
                setPlayer1({
                    paddle: paddle1,
                    score: 0,
                    username: username,
                    opponent: opponent,
                    preferences: pref,
                    order: 0,
                    urlImg: urlImg1,
                });
                setPlayer2({
                    paddle: paddle2,
                    score: 0,
                    username: opponent,
                    opponent: username,
                    preferences: pref2,
                    order: 1,
                    urlImg: urlImg2,
                });
            } else {
                paddle1.color = pref2.paddleColor;
                paddle2.color = pref.paddleColor;
                setPlayer1({
                    paddle: paddle2,
                    score: 0,
                    username: username,
                    opponent: opponent,
                    preferences: pref,
                    order: 1,
                    urlImg: urlImg1,
                });

                setPlayer2({
                    paddle: paddle1,
                    score: 0,
                    username: opponent,
                    opponent: username,
                    preferences: pref2,
                    order: 0,
                    urlImg: urlImg2,
                });
            }
            setGameId(gameId);
            setWaitState(false);
        });

        return () => {
            socket?.off('connect');
            socket?.off('match_found');
        };
    }, [socket]);

    return (
        <div className='queue-outer-container' style={getMap()}>
            {waitState ? (
                <div className='queue-container '>
                    <LoadingAnimation />
                    <h1 className='queue-h1'>Waiting for players...</h1>
                </div>
            ) : (
                <div className='game-container'>
                    <Game
                        userId={id}
                        player1={player1}
                        player2={player2}
                        gameId={Number(gameId)}
                        resetState={resetState}
                        isSpectate={false}
                    />
                </div>
            )}
        </div>
    );
};

export default Queue;
