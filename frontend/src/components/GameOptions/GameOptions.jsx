import againstFriendsImg from "../../assets/against_friends_img.jpg";
import GameOption from '../GameOptionCard/GameOption'
import againstAi from "../../assets/against_ai.jpg";

export default function () {
    return (
        <div className="game-options">
            <p className="home-text">
                LET'S GET THE <br /> GAME BEGIN
            </p>
            <div className="options">
                <GameOption img={againstFriendsImg} title={"Matchmaking"} />
                <GameOption img={againstAi} title={"Play Against AI"} />
            </div>
        </div>
    )
}