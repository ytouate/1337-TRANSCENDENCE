import GameOption from "../../components/GameOption/GameOption";
import againstFriendsImg from "../../assets/against_friends_img.jpg";
import matchmakingImg from "../../assets/matchmaking_img.jpg";
import againstAi from "../../assets/against_ai.jpg";
import background from "../../assets/background_3.jpg";
import LeaderBoardCard from "../../components/LeaderBoard/LeaderBoard";
import FrinedsList from "../../components/FriendsList/FriendsList";

import "./Home.css";

function Home() {
  return (
    <section className="home">
      <div className="game-options">
        <p className="home-text">
          LET'S GET THE <br /> GAME BEGIN
        </p>
        <div className="options">
          <GameOption img={againstFriendsImg} title={"Matchmaking"} />
          <GameOption img={againstAi} title={"Play Against AI"} />
        </div>
      </div>
      <FrinedsList />
      <LeaderBoardCard />
    </section>
  );
}

export default Home;
