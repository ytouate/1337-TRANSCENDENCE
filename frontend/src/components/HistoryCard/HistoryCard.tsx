import './HistoryCard.css';
import profileImg from '../../assets/ytouate.jpeg';

type HistoryCardData = {
    userImg: string;
    opponentImg: string;
    userScore: string;
    userName?: string;
    opponentName?: string;
    opponentScore: string;
};

function MatchCard(props: HistoryCardData) {
    return (
        <div className='match-card'>
            <div className='match-card--left'>
                <img
                    src={props.userImg}
                    alt=''
                    className='card--user-profile'
                />
                <p className='match-card--player'>{props.userName}</p>
            </div>
            <div className='match-card--status'>
                {props.userScore} - {props.opponentScore}
            </div>
            <div className='match-card--right'>
                <img
                    src={props.opponentImg}
                    alt=''
                    className='card--user-profile'
                />
                <p className='match-card--player'>{props.opponentName}</p>
            </div>
        </div>
    );
}

export default MatchCard;
