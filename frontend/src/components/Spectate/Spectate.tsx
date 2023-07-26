import MatchCard from "../MatchCard";
import "./Spectate.css";

function LiveMatch() {
    return (
        <div className="live-match">
            <MatchCard />
            <button style={{ width: "100%" }} className="button">
                Spectate
            </button>
        </div>
    );
}
export function Spectate() {
    return (
        <div className="spectate" style={{}}>
            <div className="live-matches-header">Live Matches</div>
            <div className="live-matches">
                <LiveMatch />
                <LiveMatch />
            </div>
        </div>
    );
}
