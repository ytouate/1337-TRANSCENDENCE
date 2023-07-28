import LeftMessageCard from "../../components/LeftMessageCard/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard/RightMessageCard";
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
import SelectedRoom from "../../components/SelectedRoom/SelectedRoom";
import GroupSideBar from "../../components/GroupSideBar/GroupSideBar";
import { ManageRoom } from "../../components/ManageRoom/ManageRoom";

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
    const [manageClicked, setManageClicked] = useState(false);
    const [option, setOption] = useState("");
    const [members, setMembers] = useState<User[]>([]);

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
        if (Cookies.get('Token')) {
            const chatSocket = io(
                `http://${import.meta.env.VITE_API_URL}/chat`,
                {
                    autoConnect: false,
                    extraHeaders: {
                        Authorization: `Bearer ${Cookies.get("Token")}`,
                    },
                }
            );

            chatSocket.connect();
            setChatSocket(chatSocket);

            chatSocket.on("onError", (err) => {
                console.log("error: ", err);
            });

            chatSocket.on("onUpdate", (miks: { message: string }) => {
                if (miks.message != "joined") {
                    setIsDmsSection(true);
                    setRoom(null);
                }
            });

            chatSocket.on("get_room", ({ room }: { room: chatRoom }) => {
                setRoom(room);
                setAllMessages(room.messages);
            });
            return () => {
                chatSocket.off("get_room");
                chatSocket.off("onError");
            };
        }
    }, []);

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
        const userLists = data.map((friend: User) => {
            return (
                <div
                    onClick={() => {
                        setSelectedUser(friend);
                        createRoom(friend);
                    }}
                    key={friend.id}
                >
                    <FriendCard
                        img={friend.urlImage}
                        name={friend.username}
                        lastmsg={friend.activitystatus.toString()}
                        addOption={false}
                    />
                </div>
            );
        });
        setIsSearching(true);
        setSearchPattern("");
        setSearchFriends(userLists);
    }

    function getUsers(e: any) {
        const { value, checked } = e.target;
        if (checked) setMembers((prev: User[]) => [...prev, value]);
        else {
            setMembers((prev: any) => {
                return prev.filter((email: string) => email != value);
            });
        }
    }

    function handleOptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setOption(e.target.value);
    }

    function takeAction(e: any) {
        e.preventDefault();
        if (option == "kick") {
            chatSocket?.emit("leaveRoom", {
                roomName: room?.roomName,
                email: members,
                kick: true,
            });
            setManageClicked(false);
        }
        if (option == "ban") {
            chatSocket?.emit("leaveRoom", {
                roomName: room?.roomName,
                email: members,
                ban: true,
            });
            setManageClicked(false);
        }
        if (option == "mute" || option == "unmute") {
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
            fetch(
                `http://${import.meta.env.VITE_API_URL}/user/` + option,
                options
            )
                .then((res) => res.json())
                .then((data) => {
                    setRoom(data);
                    location.reload();
                }); // ! added it may cause an error
            setManageClicked(false);
            setMembers([]);
        }
        if (option == "add-admins") {
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
            fetch(
                `http://${import.meta.env.VITE_API_URL}/user/addAdmin`,
                options
            )
                .then((res) => res.json())
                .then((data) => {
                    setRoom(data);
                    location.reload();
                }); // ! added it may cause an error
            setManageClicked(false);
            setMembers([]);
        }
        if (option == "invite") {
            chatSocket?.emit("joinRoom", {
                roomName: room?.roomName,
                email: members,
            });
            setRoom(room); // ! added it may cause an error
            setManageClicked(false);
            setMembers([]);
            location.reload();
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
                        {!isDmsSection && (
                            <a
                                onClick={() =>
                                    setCreateRoomClicked(!createRoomClicked)
                                }
                            >
                                <img
                                    style={{
                                        marginRight: "10px",
                                        width: "25px",
                                    }}
                                    src={createRoomIcon}
                                />
                            </a>
                        )}
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
                                room={room!}
                                chatRooms={user.roomChat}
                                setIsDmsSection={setIsDmsSection}
                            />
                        )}
                    </div>
                </div>

                <div className="chat-body">
                    <div className="chat-body-header">
                        {isDmsSection ? (
                            <CurrentChattingUser
                                userId={user.id}
                                selectedUser={selectedUser!}
                            />
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
            </div>
            {manageClicked && (
                <ManageRoom
                    user={user}
                    setManageClicked={setManageClicked}
                    takeAction={takeAction}
                    room={room!}
                    option={option}
                    getUsers={getUsers}
                    handleOptionChange={handleOptionChange}
                />
            )}
        </div>
    );
}
