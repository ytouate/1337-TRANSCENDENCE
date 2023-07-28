import "./Achievements.css";
import { User } from "../../context/Types";
import trophiesIcon from "../../assets/trophies.svg";
import playerImg from "../../assets/player.png";
import batalImg from "../../assets/batal.png";
import extrovertImg from "../../assets/extrovert.png";

function AchievementCard({
    img,
    title,
    description,
}: {
    img: string;
    title: string;
    description: string;
}) {
    return (
        <div className="achievements-card">
            <div>
                <img
                    className="achievements-img"
                    style={{ width: "100px" }}
                    src={img}
                    alt=""
                />
            </div>
            <div className="achievements-data">
                <p className="achievements-title">{title}</p>
                <p className="achievements-description">{description}</p>
            </div>
        </div>
    );
}
export default function Achievements({ user }: { user: User }) {
    const extrovert = user.friends?.length > 3;
    const batal = user.winStreak > 3;
    const player = (user.loss + user.win) > 10;
    const hasNotAchievement: boolean = !extrovert && !batal && !player;

    return (
        <div className="profile--achievements">
            <div className="profile--achievements-header">
                <img src={trophiesIcon} alt="" />
                <p>Achievements</p>
            </div>
            <div className="profile--achievements-body">
                {hasNotAchievement && (
                    <>
                        <p>You have no achievements</p>
                        <p className="span"> go conquer</p>
                    </>
                )}
                {extrovert && (
                    <AchievementCard
                        img={extrovertImg}
                        title="Extrovert"
                        description="you got more than 3 friends"
                    />
                )}
                {batal && (
                    <AchievementCard
                        img={batalImg}
                        title="Batal"
                        description="you have more than 3 winstreak"
                    />
                )}
                {player && (
                    <AchievementCard
                        img={playerImg}
                        title="Player"
                        description="you have more than 10 matches"
                    />
                )}
            </div>
        </div>
    );
}
