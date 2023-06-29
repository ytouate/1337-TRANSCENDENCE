import GameOptions from "../../components/GameOptions/GameOptions";
import againstFriendsImg from "../../assets/against_friends_img.jpg";
import matchmakingImg from "../../assets/matchmaking_img.jpg";
import againstAi from "../../assets/against_ai.jpg";
import background from "../../assets/background_3.jpg";
import LeaderBoardCard from '../../components/LeaderBoard/LeaderBoard'
import FrinedsList from '../../components/FriendsList/FriendsList'

import "./Home.css";

function Home() {
    return (
        <section className="home">
            <div className="home-left">
                <div className="game-options">
                    <GameOptions
                        img={againstFriendsImg}
                        title={"enter Matchmaking"}
                    />
                    <GameOptions img={againstAi} title={"Play Against AI"} />
                </div>
            </div>
            <FrinedsList />
        </section>
    );
}

export default Home;
