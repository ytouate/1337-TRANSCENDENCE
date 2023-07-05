import "./LeaderBoard.css";
import ytouate from "../../assets/ytouate.jpeg";
import leaderboardIcon from "../../assets/leaderboard-icon.svg";

function LeaderBoardCard() {
    return (
        <div className="leaderboard-card">
            <img src={ytouate} alt="" />
            <p className="leaderboard-card--name">ytouate</p>
            <p className="leaderboard-card--rate">
                50<span>%</span>
            </p>
        </div>
    );
}
function LeaderBoard() {
    return (
        <div className="leaderboard">
            <div className="leaderboard--header">
                <img src={leaderboardIcon} alt="" />
                <h3>Leaderboard</h3>
            </div>
            <div className="leaderboard--body">
                <div className="scroll-div">
                    <LeaderBoardCard />
                    <LeaderBoardCard />
                    <LeaderBoardCard />
                    <LeaderBoardCard />
                    <LeaderBoardCard />
                    <LeaderBoardCard />
                    <LeaderBoardCard />
                    <LeaderBoardCard />
                </div>
            </div>
        </div>
    );
}

export default LeaderBoard;
