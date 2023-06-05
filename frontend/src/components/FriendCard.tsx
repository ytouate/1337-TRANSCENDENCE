import img from "../assets/ytouate.jpeg";

function FriendCard() {
    return (
        <div className="friend-card">
            <img src={img} alt="" className="friend-card--profile" />
            <div className="friend-card--data">
                <p className="friend-card--username">otmallah</p>
                <p className="friend-card--lastmessage">Online</p>
            </div>
        </div>
    );
}

export default FriendCard;
