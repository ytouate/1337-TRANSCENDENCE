import "./LeaderBoard.css";
import ytouate from "../../assets/ytouate.jpeg";
function LeaderBoard(props) {
  return (
    <div className="leaderboard-wrapper">
      <h3>Leaderboard</h3>
      <div className="leaderboard">
        <table className="leaderboard-table">
          <tr className="leaderboard-header">
            <th>Rank</th>
            <th>User</th>
            <th>Win rate</th>
          </tr>
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
        </table>
      </div>
    </div>
  );
}

export default LeaderBoard;
