import { Fragment, useEffect, useState } from 'react';
import MatchCard from '../MatchCard';
import './Spectate.css';
import Cookies from 'js-cookie';
import { useLoaderData, useNavigate } from 'react-router-dom';

interface Props {
    gameId: number;
    username1: string;
    username2: string;
    userImg1: string;
    userImg2: string;
    score1: number;
    score2: number;
    onSpectateClick: (gameId: number) => void;
}

function LiveMatch(props: Props) {
    return (
        <div className='live-match'>
            <MatchCard
                username1={props.username1}
                username2={props.username2}
                score1={props.score1}
                score2={props.score2}
                userImg1={props.userImg1}
                userImg2={props.userImg2}
            />
            <button
                onClick={() => {
                    props.onSpectateClick(props.gameId);
                }}
                style={{ width: '100%' }}
                className='button'
            >
                Spectate
            </button>
        </div>
    );
}
export function Spectate() {
    const [games, setGames] = useState([]);
    const user: any = useLoaderData();
    const navigate = useNavigate();

    const onSpectateClick = (gameId: number) => {
        //redirect to spectating page using the id
        console.log(gameId);
        navigate(`/spectate/${gameId}`);
    };

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('Token')}`,
            },
        };
        const id: number = user.id;
        const url = `http://localhost:3000/game/live/${id}`;
        fetch(url, options)
            .then((res) => res.json())
            .then((data) => setGames(Object.values(data)));
    }, []);

    const liveGameList = games.map((game: any) => {
        let player1, player2;
        if (game.playerOrder === game.players[0].id) {
            player1 = game.players[0];
            player2 = game.players[1];
        } else {
            player2 = game.players[0];
            player1 = game.players[1];
        }
        return (
            <Fragment key={game.id}>
                <LiveMatch
                    gameId={game.id}
                    score1={game.score1}
                    score2={game.score2}
                    username1={player1.username}
                    username2={player2.username}
                    userImg1={player1.urlImage}
                    userImg2={player2.urlImage}
                    onSpectateClick={() => {
                        onSpectateClick(game.id);
                    }}
                />
            </Fragment>
        );
    });

    return (
        <div className='spectate' style={{}}>
            <div className='live-matches-header'>Live Matches</div>
            <div className='live-matches'>{liveGameList}</div>
        </div>
    );
}
