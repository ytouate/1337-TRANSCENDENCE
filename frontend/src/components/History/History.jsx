import MatchCard from "../../components/HistoryCard/HistoryCard";
import historyIcon from "../../assets/history-icon.svg";
import './History.css'
export default function History() {
    return (
        <div className="profile--histroy">
            <div className="profile--history-header">
                <img src={historyIcon} alt="" />
                <p>Match History</p>
            </div>
            <div className="profile--history-matches">
                <MatchCard />
                <MatchCard />
                <MatchCard />
                <MatchCard />
            </div>
        </div>
    );
};