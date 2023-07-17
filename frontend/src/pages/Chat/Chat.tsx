import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import "./Chat.css";
import { authContext } from "../../context/Context";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function Chat() {
    const [isSignedIn, setIsSignedIn] = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;
    return (
        <div className="chat-wrapper">
            <div className="chat">
                <div className="chat-toggler"></div>
                <div className="chat-users"></div>
                <div className="chat-body">
                    <LeftMessageCard />
                    <RightMessageCard
                        message="Wafeen"
                        time={new Date()}
                        sender="ytouate"
                    />
                </div>
            </div>
        </div>
    );
}
