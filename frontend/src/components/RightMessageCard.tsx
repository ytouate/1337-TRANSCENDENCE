import img from "../assets/ytouate.jpeg";

function RightMessageCard() {
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
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Repudiandae odio ratione eveniet eum praesentium nemo tempore,
                laborum voluptatum qui voluptates beatae sunt ullam, aspernatur
                obcaecati deserunt. Animi aspernatur mollitia eligendi!
            </p>
        </div>
    );
}

export default RightMessageCard;
