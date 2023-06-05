import UserMessageCard from "../UserMessageCard";
import img from "../assets/otmallah.jpeg";
import LeftMessageCard from "../LeftMessageCard";
import RightMessageCard from "../RightMessageCard";
import FriendCard from "../FriendCard";
import Navbar from "./Navbar";

function Chat() {
    return (
        <div className="wrapper">
            <Navbar />
            <div className="line-break"></div>
            <section className="chat-page">
                <div className="messages-container">
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                    <UserMessageCard />
                </div>
                <div className="chat-container">
                    <LeftMessageCard />
                </div>
                <div className="friends-container">
                    <FriendCard />
                </div>
            </section>
        </div>
    );
}

export default Chat;
