import statsIcon from '../../assets/stats.svg'
import './Stats.css'

export default function Stats() {
    return <div className="stats">
        <div className="stats--header">
            <img src={statsIcon} alt="" />
            <p>Stats</p>
        </div>
        <div className="stats--body">

            <div className="status-card">
                30 Games
            </div>
            <div className="wins-loses-rate">
                <div className="status-card">25 Wins</div>
                <div className="status-card">5 Losses</div>
                <div className="status-card">80%  rate</div>
            </div>
        </div>
    </div>;
};
