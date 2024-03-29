import againstFriendsImg from "../../assets/against_friends_img.jpg";
import GameOption from "../GameOptionCard/GameOption";
import againstAi from "../../assets/against_ai.jpg";
import "./GameOptions.css";

export default function GameOptions () {
  return (
    <div className="game-options">
      <p className="home-text">
        LET'S GET THE <br /> GAME BEGIN
      </p>
      <div className="options">
        <GameOption img={againstFriendsImg}  type='matchmaking' title={"Matchmaking"} />
        <GameOption img={againstAi} type='ai' title={"Play Against AI"} />
      </div>
    </div>
  );
}
