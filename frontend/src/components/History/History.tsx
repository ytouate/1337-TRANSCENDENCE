import MatchCard from "../HistoryCard/HistoryCard";
import historyIcon from "../../assets/history-icon.svg";
import profileImg from "../../assets/ytouate.jpeg";

import "./History.css";
export default function History() {
    return (
        <div className="profile--histroy">
            <div className="profile--history-header">
                <img src={historyIcon} alt="" />
                <p>Match History</p>
            </div>
            <div className="profile--history-matches">
                <MatchCard userImg={profileImg} opponentImg={profileImg} />
                <MatchCard userImg={profileImg} opponentImg={profileImg} />
                <MatchCard userImg={profileImg} opponentImg={profileImg} />
                <MatchCard userImg={profileImg} opponentImg={profileImg} />
            </div>
        </div>
    );
}
