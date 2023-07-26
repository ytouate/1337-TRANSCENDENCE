import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import "./Chat.css";
import { useEffect, useState, useContext } from "react";
import { authContext } from "../../context/Context";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
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
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import optionsIcon from "../../assets/options.svg";

function GroupSideBar({
    chatRooms,
    setRoom,
    socket,
}: {
    chatRooms: chatRoom[];
    setRoom(room: chatRoom): void;
    socket: Socket;
}) {
    const [groups, setGroups] = useState<chatRoom[]>([]);
    useEffect(() => {
        setGroups(
            chatRooms.filter(
                (room: any) => room.isDms == false && room.status == "private"
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

    const [groupList, setGroupList] = useState<any>([]);

    const [wantsToJoinProtected, setWantToJoinProtected] = useState(false);
    function joinProtectedRoom(roomName: string) {
        socket.emit("joinRoom", { roomName: roomName, password: password });
    }
    const [password, setPassword] = useState("");
    useEffect(() => {
        if (groups) {
            setGroupList(
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
                                            email: [],
                                        });
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
                                            console.log("here");
                                            setWantToJoinProtected(true);
                                            joinProtectedRoom(group.roomName);
                                        }
                                        // location.reload();
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
                })
            );
        }
    }, [groups, password, wantsToJoinProtected]);
    return <>{groupList}</>;
}

function SelectedRoom({
    room,
    user,
    setManageClicked,
}: {
    room: chatRoom;
    user: User;
    setManageClicked(value: boolean): void;
}) {
    return (
        <>
            {room && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: "20px",
                    }}
                    className="selected-room"
                >
                    <div className="chatting-user">
                        <img src={roomImg} alt="" />
                        <div className="chatting-user-data">
                            <p>{room.roomName}</p>
                            <p>{room.users?.length} active users</p>
                        </div>
                    </div>
                    {room.admins.find((admin) => admin == user.email) && (
                        <button
                            onClick={() => setManageClicked(true)}
                            className="button"
                            style={{ width: "fit-content" }}
                        >
                            manage users
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

function ManageRoom({
    handleOptionChange,
    takeAction,
    room,
    getUsers,
}: {
    handleOptionChange(option: any): any;
    room: chatRoom;
    takeAction(e: any): void;
    getUsers(event: any): void;
}) {
    return (
        <div
            style={{
                zIndex: "1",
                position: "absolute",
                top: "50%",
                left: "50%",
            }}
            className="manage-form"
        >
            <form onSubmit={(e) => takeAction(e)} className="room-form">
                <div className="status-field">
                    <div className="status-option">
                        <input
                            required
                            onChange={(e) => handleOptionChange(e)}
                            type="radio"
                            id="kick"
                            value="kick"
                            name="action"
                        />
                          <label htmlFor="kick">kick</label>
                    </div>
                    <div className="status-option">
                        <input
                            required
                            onChange={(e) => handleOptionChange(e)}
                            type="radio"
                            id="ban"
                            value="ban"
                            name="action"
                        />
                        <label htmlFor="ban">ban</label>
                    </div>
                    <div className="status-option">
                        <input
                            required
                            onChange={(e) => handleOptionChange(e)}
                            type="radio"
                            id="unmute"
                            name="action"
                            value="unmute"
                        />
                          <label htmlFor="mute">unmute</label>
                    </div>
                    <div className="status-option">
                        <input
                            required
                            onChange={(e) => handleOptionChange(e)}
                            type="radio"
                            id="mute"
                            name="action"
                            value="mute"
                        />
                          <label htmlFor="mute">mute</label>
                    </div>
                </div>
                <p>Choose Members</p>
                <div className="room-form-friends-section">
                    {room.users.map((friend: User) => {
                        return (
                            <div key={friend.id} className="select-field">
                                <input
                                    value={friend.email}
                                    onChange={(e) => getUsers(e)}
                                    name="selectedUsers"
                                    type="checkbox"
                                />
                                <label>
                                    <FriendCard
                                        name={friend.username}
                                        img={friend.urlImage}
                                        lastmsg={
                                            friend.activitystatus
                                                ? "Online"
                                                : "Offline"
                                        }
                                        addOption={false}
                                    />
                                </label>
                            </div>
                        );
                    })}
                </div>
                <button className="button">submit</button>
            </form>
        </div>
    );
}

export default function Chat() {
    const [isSignedIn]: any = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;
    const navigator = useNavigate();
    const user: any = useLoaderData();
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [room, setRoom] = useState<chatRoom | null>(null);
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [isDmsSection, setIsDmsSection] = useState(true);
    const [chatSocket, setChatSocket] = useState<Socket | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchPattern, setSearchPattern] = useState("");
    const [searchedFriends, setSearchFriends] = useState([]);
    const [createRoomClicked, setCreateRoomClicked] = useState(false);

    function sendMessage(e: any) {
        e.preventDefault();
        if (room && message.trim().length > 0) {
            chatSocket?.emit("sendMessage", {
                roomName: room.roomName,
                data: message.trim(),
                email: room.users?.map((user) => user.email),
            });
            setMessage("");
        }
    }

    async function createRoom(chattingUser: User) {
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

    useEffect(() => {
        const chatSocket = io("http://localhost:3000/chat", {
            autoConnect: false,
            extraHeaders: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
            },
        });

        chatSocket.connect();
        setChatSocket(chatSocket);

        chatSocket.on("onError", (err) => {
            setError(err);
            console.log("error: ", err);
        });
        chatSocket.on("get_room", ({ room }: any) => {
            setRoom(room);
            setAllMessages(room.messages);
        });
    }, []);

    const [error, setError] = useState("");
    useEffect(() => {
        if (chatSocket) {
            chatSocket.on("onMessage", (msg: Message) => {
                if (msg.roomName == room?.roomName) {
                    setAllMessages((prev: Message[]) => {
                        return prev.length > 0 ? [...prev, msg] : [msg];
                    });
                }
                navigator("/chat");
            });
        }
        return () => {
            chatSocket?.off("onMessage");
        };
    });

    useEffect(() => {
        setSelectedUser(null);
        navigator("/chat");
    }, [isDmsSection]);

    const privateMessages =
        room &&
        allMessages?.map((msg: Message) => {
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

    async function handleSearch(e: any) {
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
        setIsSearching(true);
        setSearchPattern("");
        setSearchFriends(userLists);
    }

    const [members, setMembers] = useState<User[]>([]);
    function getUsers(e: any) {
        const { value, checked } = e.target;
        console.log("am here");

        if (checked) setMembers((prev: any) => [...prev, value]);
        else {
            setMembers((prev: any) => {
                return prev.filter((email: string) => email != value);
            });
        }
    }
    const [manageClicked, setManageClicked] = useState(false);
    const [option, setOption] = useState("");

    function handleOptionChange(e) {
        setOption(e.target.value);
    }
    function takeAction(e) {
        e.preventDefault();
        if (option == "kick") {
            chatSocket?.emit("leaveRoom", {
                roomName: room?.roomName,
                email: members,
                kick: true,
            });
        }
        if (option == "ban") {
            chatSocket?.emit("leaveRoom", {
                roomName: room?.roomName,
                email: members,
                ban: true,
            });
        }
        if (option == "mute" || option == 'unmute') {
            const options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Cookies.get("Token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomName: room?.roomName,
                    email: members,
                }),
            };
            fetch("http://localhost:3000/user/" + option, options)
                .then((res) => res.json())
                .then((data) => console.log("muted succefullly : ", data));
        }
    }
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
                                style={{ marginRight: "10px", width: "25px" }}
                                src={createRoomIcon}
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
                                socket={chatSocket!}
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
                            <SelectedRoom
                                user={user}
                                setManageClicked={setManageClicked}
                                room={room!}
                            />
                        )}
                    </div>
                    <div className="chat-body-content">{privateMessages}</div>
                    <div className="chat-body-footer">
                        {room &&
                            !room.muteUsers.find(
                                (muteUser) => muteUser == user.email
                            ) && (
                                <form
                                    onSubmit={sendMessage}
                                    className="message-sender"
                                >
                                    <input
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
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
                {manageClicked && (
                    <ManageRoom
                        takeAction={takeAction}
                        room={room!}
                        getUsers={getUsers}
                        handleOptionChange={handleOptionChange}
                    />
                )}
            </div>
        </div>
    );
}
