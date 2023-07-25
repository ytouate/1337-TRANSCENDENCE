import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import FriendCard from "../../components/FriendCard/FriendCard";
import "./Chat.css";
import { authContext } from "../../context/Context";
import { Fragment, useContext, useEffect, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";
import ytouate from "../../assets/ytouate.jpeg";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { nanoid } from "nanoid";

export function CurrentChattingUser(props) {
    return (
        <>
            {props.selectedUser && (
                <div className="chatting-user">
                    <img src={props.selectedUser.urlImage} alt="" />
                    <div className="chatting-user-data">
                        <p>{props.selectedUser.username}</p>
                        {/* <p className="chatting-user-lastmsg"></p> */}
                    </div>
                </div>
            )}
        </>
    );
}

export function SideBar() {
    return (
        <div className="chat-users">
            <div className="chat-users-header">
                <p>Friends</p>
            </div>
            <div className="chat-users-content">{}</div>
        </div>
    );
}

function checkChatRoom(chatRooms: any, username: string) {
    for (const room of chatRooms) {
        for (const roomUser of room.users) {
            if (roomUser.username == username && room.users.length == 2) {
                return room;
            }
        }
    }
    return null;
}

async function getRoomByName(roomName) {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    };
    const res = await fetch(
        `http://localhost:3000/user/getRoom?` +
            new URLSearchParams({
                roomName: roomName,
            }),
        options
    );
    const data = await res.json();
    return data;

    // .then((data) => setRoom(data));
}
export default function Chat() {
    const [isSignedIn] = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;

    const user: any = useLoaderData();
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [room, setRoom] = useState([]);

    const chatSocket = io.connect("http://localhost:3000/chat", {
        extraHeaders: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    });

    function sendMessage(e) {
        e.preventDefault();
        if (room && message.trim().length > 0) {
            console.log("emitted\n");
            console.log("socket", chatSocket);
            console.log('rroooom name : ', room.roomName);
            
            chatSocket.emit("sendMessage", {
                roomName: room.roomName,
                data: message.trim(),
            });
            setMessage("");
        }
    }

    function createRoom(e, chattingUser: any) {
        setSelectedUser(chattingUser);
        const room = checkChatRoom(user.roomChat, chattingUser.username);
        if (room == null) {
            chatSocket.emit("createRoom", {
                roomName: `${user.username}${chattingUser.username}`,
                status: "public",
                username: chattingUser.username,
            });
            getRoomByName(`${user.username}${chattingUser.username}`).then(
                (data) => setRoom(data)
            );
        } else {
            setRoom(room);
        }
    }


    useEffect(() => {
        chatSocket.on("onMessage", (msg: any) => {
            console.log("message received", msg);
        });
    }, []);


    return (
        <div className="chat-wrapper">
            <div className="chat">
                <div className="chat-toggler">
                    <button onClick={() => setSelectedUser(null)}>clear</button>
                    {user.friends.map((friend: any) => {
                        return (
                            <img
                                key={friend.id}
                                onClick={(e) => createRoom(e, friend)}
                                src={friend.urlImage}
                                className="home-profile-img"
                                alt=""
                            />
                        );
                    })}
                </div>
                <SideBar />
                <div className="chat-body">
                    <div className="chat-body-header">
                        <CurrentChattingUser selectedUser={selectedUser} />
                    </div>
                    <div className="chat-body-content">
                        {room &&
                            room.messages?.map((msg) => {
                                const found = room.users.find(
                                    (user) => user.id == msg.userId
                                );
                                if (found) {
                                    if (msg.userId == user.id) {
                                        return (
                                            <RightMessageCard
                                                key={msg.id}
                                                message={msg.data}
                                                time={msg.time}
                                                sender={found.username}
                                                img={found.urlImage}
                                            />
                                        );
                                    } else {
                                        return (
                                            <LeftMessageCard
                                                key={msg.id}
                                                message={msg.data}
                                                time={msg.time}
                                                sender={found.username}
                                                img={found.urlImage}
                                            />
                                        );
                                    }
                                }
                            })}
                    </div>
                    <div className="chat-body-footer">
                        <form onSubmit={sendMessage} className="message-sender">
                            <input
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                                type="text"
                            />
                            <button
                                onClick={sendMessage}
                                className="send-button"
                            >
                                send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
