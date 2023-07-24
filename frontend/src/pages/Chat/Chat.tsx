import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import "./Chat.css";
import { useEffect, useState, useContext } from "react";
import { authContext } from "../../context/Context";
import { Navigate, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import FriendCard from "../../components/FriendCard/FriendCard";

import {
    User,
    Props,
    chatRoom,
    Message,
    CurrentChattingUserProps,
} from "../../context/Types";

export function CurrentChattingUser({
    selectedUser,
}: CurrentChattingUserProps) {
    return (
        <>
            {selectedUser && (
                <div className="chatting-user">
                    <img src={selectedUser.urlImage} alt="" />
                    <div className="chatting-user-data">
                        <p>{selectedUser.username}</p>
                        <p
                            className={
                                selectedUser.activitystatus
                                    ? "chatting-user-lastmsg online"
                                    : "chatting-user-lastmsg"
                            }
                        >
                            {selectedUser.activitystatus ? "Online" : "offline"}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export function SideBar({ user, setSelectedUser, createRoom, setRoom }: Props) {
    const activeRooms = user.roomChat.filter((room) => {
        return room.messages.length > 0;
    });
    return (
        <div className="chat-users">
            <div className="chat-users-header">
                <p>Friends</p>
            </div>
            <div className="chat-users-content">
                {activeRooms &&
                    activeRooms.map((room) => {
                        return (
                            <div key={room.id}>
                                {room.users.map((member) => {
                                    if (member.id != user.id)
                                        return (
                                            <div
                                                key={member.id}
                                                onClick={() => {
                                                    createRoom(member);
                                                    setSelectedUser(member);
                                                }}
                                            >
                                                <FriendCard
                                                    img={member.urlImage}
                                                    name={member.username}
                                                    lastmsg={
                                                        room.messages[
                                                            room.messages
                                                                .length - 1
                                                        ]?.data
                                                    }
                                                    addOption={false}
                                                />
                                            </div>
                                        );
                                })}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default function Chat() {
    const [isSignedIn]: any = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;

    const user: any = useLoaderData();
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [room, setRoom] = useState<chatRoom | null>(null);
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    function sendMessage(e: any) {
        e.preventDefault();
        if (room && message.trim().length > 0) {
            chatSocket?.emit("sendMessage", {
                roomName: room.roomName,
                data: message.trim(),
            });
            setMessage("");
        }
    }

    async function createRoom(chattingUser: any) {
        setSelectedUser(chattingUser);
        const roomName: string =
            user.username > chattingUser.username
                ? `${user.username}${chattingUser.username}`
                : `${chattingUser.username}${user.username}`;

        chatSocket?.emit("createRoom", {
            roomName: roomName,
            status: "private",
            email: [chattingUser.email],
        });
    }

    const [chatSocket, setChatSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const chatSocket = io("http://localhost:3000/chat", {
            autoConnect: false,
            extraHeaders: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
            },
        });
        chatSocket.connect();
        setChatSocket(chatSocket);
        chatSocket.on("onMessage", (msg: any) => {
            setAllMessages((prev: Message[]) => {
                return [...prev, msg];
            });
        });

        chatSocket.on("get_room", ({ room }: any) => {
            setRoom(room);
            setAllMessages(room.messages);
        });
    }, []);

    return (
        <div className="chat-wrapper">
            <div className="chat">
                <div className="chat-toggler">
                    {user.friends.map((friend: any) => {
                        return (
                            <img
                                key={friend.id}
                                onClick={() => createRoom(friend)}
                                src={friend.urlImage}
                                className="home-profile-img"
                                alt=""
                            />
                        );
                    })}
                </div>
                <SideBar
                    user={user}
                    setSelectedUser={setSelectedUser}
                    setRoom={setRoom}
                    createRoom={createRoom}
                />
                <div className="chat-body">
                    <div className="chat-body-header">
                        <CurrentChattingUser selectedUser={selectedUser!} />
                    </div>
                    <div className="chat-body-content">
                        {room &&
                            allMessages?.length > 0 &&
                            allMessages.map((msg: any) => {
                                if (msg.userId == user.id) {
                                    return (
                                        <RightMessageCard
                                            key={nanoid()}
                                            message={msg.data}
                                            time={msg.time}
                                            sender={user.username}
                                            img={user.urlImage}
                                        />
                                    );
                                } else {
                                    const found = room.users.find(
                                        (user) => user.id == msg.userId
                                    );
                                    if (found) {
                                        return (
                                            <LeftMessageCard
                                                key={nanoid()}
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
                        {room && (
                            <form
                                onSubmit={sendMessage}
                                className="message-sender"
                            >
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
