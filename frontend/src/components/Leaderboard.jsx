import ytouate from "../assets/ytouate.jpeg";
import FriendCard from "./FriendCard";
import RankCard from './RankCard'
import leaderboardImg from '../assets/leaderboard-img.jpg'

function Leaderboard() {
    return (
        <div className="leaderboard">
            <div className="leaderboard-left">
                <div className="leaderboard-types">
                    <div className="leaderboard-type-card">
                        <p>all time</p>
                    </div>
                    <div className="leaderboard-type-card">
                        <p>daily</p>
                    </div>
                    <div className="leaderboard-type-card">
                        <p>weekly</p>
                    </div>
                </div>

                <div className="first-three">
                    <div className="second">
                        <img src={ytouate} alt="" />
                        <p>@ytouate</p>
                    </div>
                    <div className="first">
                        <img src={ytouate} alt="" />
                        <p>@ytouate</p>
                    </div>
                    <div className="third">
                        <img src={ytouate} alt="" />
                        <p>@ytouate</p>
                    </div>
                </div>
                <div className="other-ranks">
                    <RankCard />
                    <RankCard />
                    <RankCard />
                    <RankCard />
                    <RankCard />
                    <RankCard />
                    <RankCard />
                </div>
            </div>
            <div className="leaderboard-right">
                <img src={leaderboardImg} alt="" />
            </div>
        </div>
    );
}

export default Leaderboard;
