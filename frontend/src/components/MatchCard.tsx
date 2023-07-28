import profileImg from '../assets/ytouate.jpeg';

interface Props {
    username1: string;
    username2: string;
    userImg1: string;
    userImg2: string;
    score1: number;
    score2: number;
}

function MatchCard({
    username1,
    username2,
    score1,
    score2,
    userImg1,
    userImg2,
}: Props) {
    return (
        <div className='match-card'>
            <div className='match-card--left'>
                <img src={userImg1} alt='' className='card--user-profile' />
                <p className='match-card--player'>{username1}</p>
            </div>
            <div className='match-card--status'>{score1} - {score2}</div>
            <div className='match-card--right'>
                <img src={userImg2} alt='' className='card--user-profile' />
                <p className='match-card--player'>{username2}</p>
            </div>
        </div>
    );
}

export default MatchCard;
