import MatchCard from '../HistoryCard/HistoryCard';
import historyIcon from '../../assets/history-icon.svg';
import profileImg from '../../assets/ytouate.jpeg';

import './History.css';
import { Fragment, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useLoaderData } from 'react-router-dom';

export default function History() {
    const [matches, setMatches] = useState([]);
    const user: any = useLoaderData();
    const { id } = user;

    useEffect(() => {
        console.log({ id });
        const options = {
            method: 'GET',
            header: {
                Authorization: `Bearer ${Cookies.get('Token')}`,
            },
        };
        const url = `http://localhost:3000/game/user/${id}`;
        console.log({ url });
        fetch(url, options)
            .then((res) => {
                // console.log(res);
                return res.json();
            })
            .then((data) => setMatches(Object.values(data)));
    }, []);

    // useEffect(() => {
    //     console.log(matches);
    // }, [matches]);

    const MatchHistory = matches.map((match: any) => {
        const player1 =
            match.playerOrder === match.players[0].id
                ? match.players[0]
                : match.players[1];
        const player2 =
            match.playerOrder === match.players[0].id
                ? match.players[1]
                : match.players[0];
        return (
            <Fragment key={match.id}>
                <MatchCard
                    userImg={player1.urlImage}
                    userName={player1.username}
                    opponentImg={player2.urlImage}
                    opponentName={player2.username}
                    userScore={match.score1}
                    opponentScore={match.score2}
                />
            </Fragment>
        );
    });
    return (
        <div className='profile--histroy'>
            <div className='profile--history-header'>
                <img src={historyIcon} alt='' />
                <p>Match History</p>
            </div>
            <div className='profile--history-matches'>{MatchHistory}</div>
        </div>
    );
}
