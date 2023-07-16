import statsIcon from "../../assets/stats.svg";
import "./Stats.css";

export default function Stats(props: any) {
  const totalGames = props.losses + props.wins;
  const winRate =
    props.wins + props.losses == 0 ? 0 : (props.wins + props.losses) / 100;
  return (
    <div className="stats">
      <div className="stats--header">
        <img src={statsIcon} alt="" />
        <p>Stats</p>
      </div>
      <div className="stats--body">
        <div className="status-card">
          {totalGames < 2 ? totalGames + " Game" : totalGames + " Games"}
        </div>
        <div className="wins-loses-rate">
          <div className="status-card">{props.wins} Wins</div>
          <div className="status-card">{props.losses} Losses</div>
          <div className="status-card">{winRate}% rate</div>
        </div>
      </div>
    </div>
  );
}
