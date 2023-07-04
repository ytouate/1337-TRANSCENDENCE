import GameOptions from "../../components/GameOptions/GameOptions";

import LeaderBoardCard from "../../components/LeaderBoard/LeaderBoard";
import ActiveFriends from "../../components/ActiveFriends/ActiveFriends";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="home--left">
        <GameOptions />
      </div>
      <div className="home--center">
        <ActiveFriends />
      </div>
      <div className="home--right">
        <LeaderBoardCard />
      </div>
    </div>
  );
}

export default Home;
