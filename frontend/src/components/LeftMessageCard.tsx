import img from "../assets/otmallah.jpeg";

function LeftMessageCard() {
    return (
        <div className="message-card">
            <div className="message-card--container">
                <img src={img} alt="" className="message-card--sender-img" />
                <div className="message-card--data">
                    <p className="message-cad--sender-name">otmallah</p>
                    <p className="message-card--message-time">5:00PM</p>
                </div>
            </div>

            <p className="message-card--message">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Repudiandae odio ratione eveniet eum praesentium nemo tempore,
                laborum voluptatum qui voluptates beatae sunt ullam, aspernatur
                obcaecati deserunt. Animi aspernatur mollitia eligendi!
            </p>
        </div>
    );
}

export default LeftMessageCard;
