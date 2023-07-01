import "./LeaderBoard.css";
import ytouate from "../../assets/ytouate.jpeg";
import leaderboardIcon from "../../assets/leaderboard-icon.svg";

function LeaderBoard(props) {
  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard--header">
        <img src={leaderboardIcon} alt="" />
        <h3>Leaderboard</h3>
      </div>
      <div className="leaderboard">
        <table className="leaderboard-table">
          <thead className="leaderboard-header">
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Win rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="leaderboard-rank">1</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
            <tr>
              <td className="leaderboard-rank">2</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
            <tr>
              <td className="leaderboard-rank">3</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
            <tr>
              <td className="leaderboard-rank">3</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
            <tr>
              <td className="leaderboard-rank">3</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
            <tr>
              <td className="leaderboard-rank">3</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
            <tr>
              <td className="leaderboard-rank">3</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
            <tr>
              <td className="leaderboard-rank">3</td>
              <td className="leaderboard-user">
                <img src={ytouate} alt="" />
                <p>ytouate</p>
              </td>
              <td className="leaderboard-rate">54%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderBoard;
