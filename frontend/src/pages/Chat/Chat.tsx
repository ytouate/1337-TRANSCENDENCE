import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import "./Chat.css";
import { useEffect, useState, useContext } from "react";
import { authContext } from "../../context/Context";
import { Navigate, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";
import { nanoid } from "nanoid";
import SearchBar from "../../components/SearchBar/SearchBar";
import { CurrentChattingUser } from "../../components/CurrentChattingUser/CurrentChattingUser";
import { DmSideBar } from "../../components/ChatSideBar/DmSideBar";
import { User, chatRoom, Message } from "../../context/Types";
import FriendCard from "../../components/FriendCard/FriendCard";
import { searchForUsers } from "../../components/FriendsList/FriendsList";
import createRoomIcon from "../../assets/create-room.svg";
import RoomFrom from "../../components/RoomForm/RoomForm";
import roomImg from "../../assets/against_friends_img.jpg";
import { createGroup } from "../../components/RoomForm/RoomForm";

function GroupSideBar({ chatRooms, setRoom, socket }: any) {
    const [groups, setGroups] = useState<chatRoom[]>([]);
    useEffect(() => {
        setGroups(
            chatRooms.filter(
                (room: any) =>
                    (room.isDms == false && room.status == "private")
            )
        );
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
            },
        };
        fetch("http://localhost:3000/user/getRooms", options)
            .then((res) => res.json())
            .then((data) =>
                setGroups((prev: chatRoom[]) => [...prev, ...data])
            );
    }, []);

    const [wantsToJoinProtected, setWantToJoinProtected] = useState(false);
    function joinProtectedRoom(roomName: string, password: string) {
        socket.emit("joinRoom", { roomName: roomName, password: password });
    }
    const [password, setPassword] = useState("");
    return (
        <>
            {groups &&
                groups.map((group: any) => {
                    if (
                        chatRooms.find((room: chatRoom) => room.id == group.id)
                    ) {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                }}
                                key={group.id}
                                onClick={(e) => {
                                    createGroup(
                                        e,
                                        socket,
                                        {
                                            roomName: group.roomName,
                                            status: group.status,
                                            password: group.password,
                                        },
                                        group.users.filter(
                                            (user: any) => user.email
                                        )
                                    );
                                    setRoom(group);
                                }}
                            >
                                <FriendCard
                                    img={roomImg}
                                    addOption={false}
                                    name={group.roomName}
                                    lastmsg={`${group.users.length} users`}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        socket.emit("leaveRoom", {
                                            roomName: group.roomName,
                                        });
                                        console.log("left room");
                                    }}
                                    className="button"
                                    style={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    Leave
                                </button>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                }}
                                key={group.id}
                            >
                                <FriendCard
                                    img={roomImg}
                                    name={group.roomName}
                                    lastmsg={`${group.users.length} users`}
                                    addOption={false}
                                />
                                <button
                                    onClick={() => {
                                        if (group.status != "protected") {
                                            socket.emit("joinRoom", {
                                                roomName: group.roomName,
                                            });
                                        } else {
                                            setWantToJoinProtected(true);
                                            joinProtectedRoom(room);
                                        }
                                        console.log("joined room");
                                    }}
                                    className="button"
                                    style={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    join
                                </button>
                                {wantsToJoinProtected && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            socket.emit("joinRoom", {
                                                roomName: group.roomName,
                                                password: password,
                                            });
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                        }}
                                        className="room-form"
                                    >
                                        <>
                                            <label htmlFor="">
                                                Room password
                                            </label>
                                            <input
                                                required
                                                type="password"
                                                name="password"
                                                className="twofactor-input"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                        </>
                                        <button
                                            style={{ width: "100%" }}
                                            className="button"
                                        >
                                            Join
                                        </button>
                                    </form>
                                )}
                            </div>
                        );
                    }
                })}
        </>
    );
}

function SelectedRoom({ room }) {
    return (
        <>
            {room && (
                <div className="chatting-user">
                    <img src={roomImg} alt="" />
                    <div className="chatting-user-data">
                        <p>{room.roomName}</p>
                        <p>{room.users?.length} active users</p>
                    </div>
                </div>
            )}
        </>
    );
}

// async function chatAction({ request }: any) {
//     console.log("action called: ", request);
// }
export default function Chat() {
    const [isSignedIn]: any = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;

    const user: any = useLoaderData();
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [room, setRoom] = useState<chatRoom | null>(null);
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [isDmsSection, setIsDmsSection] = useState(true);
    function sendMessage(e: any) {
        e.preventDefault();
        if (room && message.trim().length > 0) {
            console.log("emitted in: ", room);

            chatSocket?.emit("sendMessage", {
                roomName: room.roomName,
                data: message.trim(),
                email: room.users?.map((user) => user.email),
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
            isDm: true,
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
        chatSocket.on("get_room", ({ room }: any) => {
            setRoom(room);
            setAllMessages(room.messages);
        });

        chatSocket.on("onMessage", (msg: any) => {
            if (msg.roomName == room?.roomName) {
                setAllMessages((prev: Message[]) => {
                    return prev.length > 0 ? [...prev, msg] : [msg];
                });
            }
        });
    }, []);

    useEffect(() => {
        if (chatSocket) {
            chatSocket.on("onMessage", (msg: any) => {
                console.log("message received");
                console.log("roomName when message arrived: ", room?.roomName);
                console.log(
                    "msg.roomName when message arrived: ",
                    msg.roomName
                );

                if (msg.roomName == room?.roomName) {
                    setAllMessages((prev: Message[]) => {
                        return prev.length > 0 ? [...prev, msg] : [msg];
                    });
                }
            });
        }

        return () => {
            chatSocket?.off("onMessage");
        };
    }, [room]);

    const privateMessages =
        room &&
        allMessages?.map((msg: any) => {
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
                const found = room.users.find((user) => user.id == msg.userId);
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
        });

    const [isSearching, setIsSearching] = useState(false);
    const [searchPattern, setSearchPattern] = useState("");
    const [searchedFriends, setSearchFriends] = useState([]);
    async function handleSearch(e: any) {
        setIsSearching(true);
        setSearchPattern("");
        const data = await searchForUsers(e, searchPattern);
        const userLists = data.map((friend: any) => {
            return (
                <div
                    onClick={() => {
                        setSelectedUser(friend);
                        createRoom(friend);
                    }}
                    key={friend.id}
                >
                    <FriendCard
                        key={friend.id}
                        img={friend.urlImage}
                        name={friend.username}
                        lastmsg={friend.activitystatus ? "Online" : "Offline"}
                        addOption={false}
                    />
                </div>
            );
        });
        setSearchFriends(userLists);
    }

    const [createRoomClicked, setCreateRoomClicked] = useState(false);
    return (
        <div className="chat-wrapper">
            {createRoomClicked && (
                <RoomFrom
                    socket={chatSocket}
                    setCreateRoomClicked={setCreateRoomClicked}
                    friends={user.friends}
                />
            )}
            <div className="chat">
                <div className="chat-users">
                    <div className="chat-users-header">
                        <a
                            onClick={() =>
                                setCreateRoomClicked(!createRoomClicked)
                            }
                        >
                            <img
                                width={25}
                                style={{
                                    marginRight: "10px",
                                }}
                                src={createRoomIcon}
                                alt=""
                            />
                        </a>
                        <button
                            className={
                                !isDmsSection
                                    ? `btn-active chat-toggler`
                                    : "chat-toggler"
                            }
                            onClick={() => {
                                setRoom(null);
                                setIsDmsSection(false);
                            }}
                        >
                            rooms
                        </button>
                        <button
                            className={
                                isDmsSection
                                    ? `btn-active chat-toggler`
                                    : "chat-toggler"
                            }
                            onClick={() => {
                                setRoom(null);
                                setIsDmsSection(true);
                                setIsSearching(false);
                            }}
                        >
                            Dms
                        </button>
                    </div>
                    <div className="chat-users-content">
                        {isDmsSection ? (
                            <>
                                <SearchBar
                                    value={searchPattern}
                                    setValue={setSearchPattern}
                                    searchForUsers={handleSearch}
                                />
                                <div className="chat-users-content">
                                    {!isSearching ? (
                                        <DmSideBar
                                            user={user}
                                            setSelectedUser={setSelectedUser}
                                            createRoom={createRoom}
                                        />
                                    ) : (
                                        searchedFriends
                                    )}
                                </div>
                            </>
                        ) : (
                            <GroupSideBar
                                socket={chatSocket}
                                setRoom={setRoom}
                                chatRooms={user.roomChat}
                            />
                        )}
                    </div>
                </div>

                <div className="chat-body">
                    <div className="chat-body-header">
                        {isDmsSection ? (
                            <CurrentChattingUser selectedUser={selectedUser!} />
                        ) : (
                            <SelectedRoom room={room} />
                        )}
                    </div>
                    <div className="chat-body-content">{privateMessages}</div>
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
