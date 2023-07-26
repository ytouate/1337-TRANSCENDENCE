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
import './Challenge.css';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation.tsx';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Challenge = () => {
    const user: any = useLoaderData();
    const { username, preference } = user;
    const id: number = user.id;
    const { hostId } = useParams();
    // let { preference } = user;

    const [waitState, setWaitState] = useState(true);
    const [gameId, setGameId] = useState(null);
    const [player1, setPlayer1] = useState<Player>({} as Player);
    const [player2, setPlayer2] = useState<Player>({} as Player);
    const navigate = useNavigate();
    // const [socket, setScoket] = useState<any>();
    const location = useLocation();
    const opponent = location.state?.username || 'player 2';

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

    const resetState = () => {};

    useEffect(() => {
        const socket = webSocketService.getSocket();

        // inform the server that we are in this page and ready to play
        socket?.emit('playerReady', {
            userId: Number(id),
            hostId: Number(hostId),
        });

        // while in this page waiting for the other player
        // if the other player declines our invitation
        // redirect him to home page and informs him that the
        // invitation has been declined
        socket?.on('invite_declined', (data: any) => {
            console.log('he declined lol');
            const username = data.username;
            console.log(`${username} has declined ur invitation`);
            navigate('/');
        });

        // if no one invited u, or if u try to acces other players
        // private lobby, u will be redirected to the home page
        socket?.on('unauthorized_lobby', (data: any) => {
            console.log('unauthorized_lobby');
            navigate('/');
        });

        // if both players are ready (emitted 'playerReady')
        // the server will emit this event and the game will start
        socket?.on('game_invite_start', (data: any) => {
            console.log('game_invite_start');
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
            // maybe cancel the invite
            if (Number(hostId) === id)
                socket?.emit('cancelInvite', { userId: id });
            socket?.off('invite_declined');
            socket?.off('game_invite_start');
            socket?.off('unauthorized_lobby');
        };
    }, []);

    return (
        <div className='queue-outer-container' style={getMap()}>
            {waitState ? (
                <div className='queue-container '>
                    <LoadingAnimation />
                    <h1 className='queue-h1'>Waiting for {opponent}...</h1>
                </div>
            ) : (
                <div className='game-container'>
                    <Game
                        userId={id}
                        player1={player1}
                        player2={player2}
                        gameId={gameId}
                        resetState={null}
                    />
                </div>
            )}
        </div>
    );
};

export default Challenge;
