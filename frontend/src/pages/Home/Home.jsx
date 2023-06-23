import GameOptions from "../../components/GameOptions/GameOptions";
import againstFriendsImg from "../../assets/against_friends_img.jpg";
import matchmakingImg from "../../assets/matchmaking_img.jpg";
import againstAi from "../../assets/against_ai.jpg";
import background from "../../assets/background_3.jpg";
import LeaderBoardCard from '../../components/LeaderBoard/LeaderBoard'

import "./Home.css";

function Home() {
    const testCardStyles = {
        backgroundColor: "red",
        width: "500px",
        height: "300px",
    };
    return (
        <section className="home">
            <div className="home-left">
                <div className="game-options">
                    <GameOptions
                        img={matchmakingImg}
                        title={"Enter Matchmaking"}
                    />
                    <GameOptions
                        img={againstFriendsImg}
                        title={"Play Against Friends"}
                    />
                    <GameOptions img={againstAi} title={"Play Against AI"} />
                </div>
                <div className="stats-cards">
                    <LeaderBoardCard />
                    {/* <div style={testCardStyles}></div> */}
                </div>
            </div>
            <div className="home-right">
                <img className="home-img" src={background} alt="" />
            </div>
        </section>
    );
}

export default Home;
