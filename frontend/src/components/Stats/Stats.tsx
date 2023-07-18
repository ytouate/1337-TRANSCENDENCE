import statsIcon from "../../assets/stats.svg";
import "./Stats.css";

interface statsType {
    wins: number;
    losses: number;
    winRate: number;
}

export default function Stats(props: statsType) {
    const totalGames = props.losses + props.wins;
    return (
        <div className="stats">
            <div className="stats--header">
                <img src={statsIcon} alt="" />
                <p>Stats</p>
            </div>
            <div className="stats--body">
                <div className="status-card">
                    {totalGames < 2
                        ? totalGames + " Game"
                        : totalGames + " Games"}
                </div>
                <div className="wins-loses-rate">
                    <div className="status-card">{props.wins} Wins</div>
                    <div className="status-card">{props.losses} Losses</div>
                    <div className="status-card">{props.winRate}% rate</div>
                </div>
            </div>
        </div>
    );
}
