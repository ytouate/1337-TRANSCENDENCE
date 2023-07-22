import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import "./Chat.css";
import { useEffect, useState, useContext } from "react";
import { authContext } from "../../context/Context";
import { Navigate, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import io from "socket.io-client";

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

async function checkChatRoom(chatRooms: any, username: string) {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    };

    const res = await fetch("http://localhost:3000/user", options);
    const user = await res.json();
    console.log("user roomChat: ", user);

    for (const room of user?.roomChat) {
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
    if (!res.ok) throw new Error("Failed to fetch");
    console.log(res);
    const data = await res.json();
    return data;
}

const chatSocket = io.connect("http://localhost:3000/chat", {
        extraHeaders: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    });
export default function Chat() {
    const [isSignedIn] = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;

    const user: any = useLoaderData();
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [room, setRoom] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    // const [socket, setSocket] = useState();

    
    function sendMessage(e) {
        e.preventDefault();
        if (room && message.trim().length > 0) {
            console.log("emitted", room);

            chatSocket.emit("sendMessage", {
                roomName: room.roomName,
                data: message.trim(),
            });
            setMessage("");
        }
    }

    // ... Other component imports and code ...

    async function createRoom(e, chattingUser: any) {
        setSelectedUser(chattingUser);
        console.log("selected user email: ", chattingUser.email);

        const roomName: string =
            user.username > chattingUser.username
                ? `${user.username}${chattingUser.username}`
                : `${chattingUser.username}${user.username}`;
        chatSocket.emit("createRoom", {
            roomName: roomName,
            status: "public",
            email: chattingUser.email,
        });

        // try {
        //     const roomData = await getRoomByName(roomName);
        //     setRoom(roomData);
        // } catch (error) {
        //     console.error("Error fetching room data:", error);
        // }
    }

    useEffect(() => {
        chatSocket.on("onMessage", (msg: any) => {
            setAllMessages((prev) => [...prev, msg]);
            console.log("message received", msg);
        });
        chatSocket.on("get_room", ({ room }: any) => {
            setRoom(room);
            setAllMessages(room.messages);
            console.log("room received", room);
        });
    }, []);

    useEffect(() => {
        console.log("all messages", allMessages);
    }, [allMessages]);

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
                            allMessages?.length > 0 &&
                            allMessages.map((msg: any) => {
                                if (msg.userId == user.id) {
                                    return (
                                        <RightMessageCard
                                            key={msg.id}
                                            message={msg.data}
                                            time={msg.time}
                                            sender={user.username}
                                            img={user.urlImage}
                                        />
                                    );
                                } else {
                                    console.log("room users hhh", room.users);
                                    const found = room.users.find(
                                        (user) => user.id == msg.userId
                                    );
                                    
                                    return (
                                        <LeftMessageCard
                                            key={msg.id}
                                            message={msg.data}
                                            time={msg.time}
                                            sender={found?.username}
                                            img={found?.urlImage}
                                        />
                                    );
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
