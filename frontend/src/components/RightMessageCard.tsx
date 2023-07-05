import img from "../assets/ytouate.jpeg";


type MessageData = {
    message: string;
}
function RightMessageCard(props: MessageData) {
    return (
        <div className="right-message-card">
            <div className="right-message-card--container">
                <div className="right-message-card--data">
                    <p className="right-message-card--sender-name">ytouate</p>
                    <p className="right-message-card--message-time">6:00PM</p>
                </div>
                <img src={img} alt="" className="right-message-card--sender-img" />
            </div>

            <p className="right-message-card--message">
                {props.message}
            </p>
        </div>
    );
}

export default RightMessageCard;
