import UserMessageCard from "./UserMessageCard";
import LeftMessageCard from "./LeftMessageCard";
import RightMessageCard from "./RightMessageCard";
import FriendCard from "./FriendCard";
import Navbar from "./ChatNav";
import sendButton from "../assets/send-line.svg";
import { useState } from "react";
function Chat() {
    let [message, setMessage] = useState('');
    let [messages, setMessages] = useState([]);
    function handleMessageChange(event) {
        setMessage(event.target.value);
    }
    function sendMessage() {
        let trimmedMessage = message.trim();
        if (trimmedMessage.length == 0)
            return ;
        let newMessages = [...messages];
        newMessages.push(<RightMessageCard key={newMessages.length} message={message} />);
        setMessage('');
        setMessages(newMessages);
    }
    return (
        <div className="wrapper">
            <div className="chat-left">
                <Navbar />
                <div className="line-break"></div>
                <section className="chat-page">
                    <div className="messages-container">
                        <UserMessageCard />
                    </div>
                    <div className="chat-container">
                        <div className="messages">
                            {messages}
                            {/* <LeftMessageCard />
                            <RightMessageCard />
                            <LeftMessageCard />
                            <RightMessageCard /> */}
                        </div>
                        <div className="message-sender">
                            <input
                                value={message}
                                onChange={handleMessageChange}
                                type="text"
                            />
                            <i className="send-button">
                                <img
                                    onClick={sendMessage}
                                    src={sendButton}
                                    alt=""
                                />
                            </i>
                        </div>
                    </div>
                    <div className="friends-container">
                        <FriendCard />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Chat;
