import "./ChallengeCard.css";


interface ChallengeCardData {
    img: string;
    name: string;
    status: string;
}

export default function ChallengeCard(props: ChallengeCardData) {
    return (
        <div className="challenge-card">
            <img src={props.img} alt="" />
            <div className="challenge-card--data">
                <p className="challenge-card--name">{props.name}</p>
                <p className="challenge-card--status">{props.status}</p>
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