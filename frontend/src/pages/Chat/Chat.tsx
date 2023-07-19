import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import FriendCard from "../../components/FriendCard/FriendCard";
import "./Chat.css";
import { authContext } from "../../context/Context";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import ytouate from "../../assets/ytouate.jpeg";

export function CurrentChattingUser() {
    return (
        <div className="chatting-user">
            <img src={ytouate} alt="" />
            <div className="chatting-user-data">
                <p>ytouate</p>
                <p className="chatting-user-lastmsg">online</p>
            </div>
        </div>
    );
}

export function SideBar() {
    return (
        <div className="chat-users">
            <div className="chat-users-header">
                <p>Friends</p>
            </div>
            <div className="chat-users-content">
                <FriendCard img={ytouate} name={"ytouate"} lastmsg={"online"} />
                <FriendCard img={ytouate} name={"ytouate"} lastmsg={"online"} />
                <FriendCard img={ytouate} name={"ytouate"} lastmsg={"online"} />
                <FriendCard img={ytouate} name={"ytouate"} lastmsg={"online"} />
            </div>
        </div>
    );
}
export default function Chat() {
    const [isSignedIn, setIsSignedIn] = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;
    return (
        <div className="chat-wrapper">
            <div className="chat">
                <div className="chat-toggler"></div>
                <SideBar />
                <div className="chat-body">
                    <div className="chat-body-header">
                        <CurrentChattingUser />
                    </div>
                    <div className="chat-body-content">
                        <LeftMessageCard />
                        <RightMessageCard
                            sender="ytouate"
                            time={new Date()}
                            message="lorem ipsum dolor"
                        />
                    </div>
                    <div className="chat-body-footer">
                        <form className="message-sender">
                            <input type="text" />
                            <button className="send-button">send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
