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
import './SpectatePage.css';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation.tsx';
import { useParams } from 'react-router-dom';

const SpectatePage = () => {
    const user: any = useLoaderData();
    const { id, username, preference } = user;
    // let { preference } = user;
    const { gameId } = useParams();

    const [waitState, setWaitState] = useState(true);
    // const [gameId, setGameId] = useState(null);
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


    useEffect(() => {
        setScoket(webSocketService.connect());

        return () => {
            setScoket(null);
        };
    }, []);

    useEffect(() => {

        if (!socket) {
            setScoket(webSocketService.connect());
        } else {
        }

        socket?.emit('spectateGame', { gameId: gameId });

        socket?.on('lobby_not_found', (data: any) => {
            navigate('/');
        });

        socket?.on('spectate_ready', (data: any) => {
            paddle1.color = data.player1.pref.paddleColor;
            paddle2.color = data.player2.pref.paddleColor;
            setPlayer1({
                paddle: paddle1,
                score: 0,
                username: data.player1.username,
                opponent: data.player2.username2,
                preferences: data.player1.pref,
                order: 0,
                urlImg: data.player1.urlImg1,
            });
            setPlayer2({
                paddle: paddle2,
                score: 0,
                username: data.player2.username,
                opponent: data.player1.c,
                preferences: data.player2.pref,
                order: 1,
                urlImg: data.player2.urlImg1,
            });
            setWaitState(false);
        });

        return () => {
            socket?.off('connect');
            socket?.off('spectate_ready');
        };
    }, [socket]);

    return (
        <div className='queue-outer-container' 
        style={waitState ? {  backgroundColor: '#28235c',
        backgroundSize: 'cover',
        backgroundPosition: 'center',} : getMap()}>
            {waitState ? (
                <div className='queue-container '>
                    <LoadingAnimation />
                    <h1 className='queue-h1'>Loading...</h1>
                </div>
            ) : (
                <div className='game-container'>
                    <Game
                        userId={id}
                        player1={player1}
                        player2={player2}
                        gameId={Number(gameId)}
                        resetState={null}
                        isSpectate={true}
                    />
                </div>
            )}
        </div>
    );
};

export default SpectatePage;
