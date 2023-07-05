import "./ActiveFriends.css";
import swordsIcon from "../../assets/sword.svg";
import ytouate from "../../assets/ytouate.jpeg";

function ChallengeCard() {
    return (
        <div className="challenge-card">
            <img src={ytouate} alt="" />
            <div className="challenge-card--data">
                <p className="challenge-card--name">ytouate</p>
                <p className="challenge-card--status">online</p>
            </div>
            <p className="challenge-card--rate">
                <button
                    className="button"
                    style={{
                        backgroundColor: "#f6f3eb",
                        fontSize: "12px",
                        color: "black",
                    }}
                >
                    Challenge
                </button>
            </p>
        </div>
    );
}
export default function ActiveFriends() {
    return (
        <div className="active-friends">
            <div className="active-friends--header">
                <img src={swordsIcon} alt="" />
                <p>Invite Friends</p>
            </div>
            <div className="active-friends--body">
                <div className="scroll-div">
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                    <ChallengeCard />
                </div>
            </div>
        </div>
    );
}
