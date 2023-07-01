import './HistoryCard.css'
import profileImg from "../../assets/ytouate.jpeg";

function  MatchCard() {
    return (
        <div className="match-card">
            <div className="match-card--left">
                <img src={profileImg} alt="" className="card--user-profile" />
                <p className="match-card--player">ytouate</p>
            </div>
            <div className="match-card--status">
                3 - 5
            </div>
            <div className="match-card--right">
                <img src={profileImg} alt="" className="card--user-profile" />
                <p className="match-card--player">ytouate</p>
            </div>
        </div>
    );
}

export default MatchCard;
