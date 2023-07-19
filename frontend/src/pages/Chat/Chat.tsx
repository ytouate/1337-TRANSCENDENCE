import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import FriendCard from "../../components/FriendCard/FriendCard";
import "./Chat.css";
import { authContext } from "../../context/Context";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";
import ytouate from "../../assets/ytouate.jpeg";
import Cookies from "js-cookie";
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
import io from "socket.io-client";
import { nanoid } from "nanoid";

export default function Chat() {
    const user: any = useLoaderData();
    const [isSignedIn, setIsSignedIn] = useContext(authContext);
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    function sendMessage(e: any) {
        e.preventDefault();
        if (message.trim().length > 0) {
            setMessage("");
            chatSocket.emit("sendMessage", {
                roomName: "ytouateotmallah",
                message: message.trim(),
            });
        }
    }

    function createRoom() {
        chatSocket.emit("createRoom", {
            roomName: "ytouateotmallah",
            status: "public",
            username: "otmallah",
        });
        console.log("room created");
    }

    const chatSocket = io.connect("http://localhost:3000/chat", {
        extraHeaders: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    });

    useEffect(() => {
        console.log("component rendered");
        createRoom();
        chatSocket.on("onMessage", (msg: any) => {
            if (user.id == msg.sender.id) {
                setAllMessages((prev) => [
                    ...prev,
                    <RightMessageCard
                        message={msg.data}
                        key={nanoid()}
                        time={new Date()}
                    />,
                ]);
            } else {
                setAllMessages((prev) => [
                    ...prev,
                    <LeftMessageCard key={nanoid()} message={msg.data} />,
                ]);
            }
        });
    }, []);

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
                    <div className="chat-body-content">{allMessages}</div>
                    <div className="chat-body-footer">
                        <form onSubmit={sendMessage} className="message-sender">
                            <input
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                                type="text"
                            />
                            <button className="send-button">send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
