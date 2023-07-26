import MatchCard from '../HistoryCard/HistoryCard';
import historyIcon from '../../assets/history-icon.svg';
import './History.css';
import { Fragment, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

export default function History() {
    const [matches, setMatches] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('Token')}`,
            },
        };
        const url = `http://localhost:3000/game/user/${id}`;
        fetch(url, options)
            .then((res) => {
                return res.json();
            })
            .then((data) => setMatches(Object.values(data)));
    }, [id]);

    const MatchHistory = matches.map((match: any) => {
        let player1, player2;
        if (match.playerOrder === match.players[0].id) {
            player1 = match.players[0];
            player2 = match.players[1];
        } else {
            player2 = match.players[0];
            player1 = match.players[1];
        }
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
