import { chatRoom, User } from "../../context/Types";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { Socket } from "socket.io-client";
import FriendCard from "../FriendCard/FriendCard";
import { createGroup } from "../RoomForm/RoomForm";
import roomImg from "../../assets/against_friends_img.jpg";
import "./GroupSideBar.css";
import { useNavigate } from "react-router-dom";

export default function GroupSideBar({
    chatRooms,
    setRoom,
    socket,
    room,
    setIsDmsSection,
}: {
    chatRooms: chatRoom[];
    setRoom(room: chatRoom | null): void;
    socket: Socket;
    room: chatRoom;
    setIsDmsSection(value: boolean): void;
}) {
    const [groups, setGroups] = useState<chatRoom[]>([]);

    useEffect(() => {
        console.log("re rendered");

        setGroups(
            chatRooms.filter(
                (room: chatRoom) =>
                    room.isDms == false && room.status == "private"
            )
        );
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
            },
        };
        fetch(`http://${import.meta.env.VITE_API_URL}/user/getRooms`, options)
            .then((res) => res.json())
            .then((data) =>
                setGroups((prev: chatRoom[]) => [...prev, ...data])
            );
    }, []);

    const [groupList, setGroupList] = useState<any>([]);
    const navigator = useNavigate();
    const [wantsToJoinProtected, setWantToJoinProtected] = useState(false);
    function joinProtectedRoom(roomName: string) {
        socket.emit("joinRoom", {
            roomName: roomName,
            password: password,
            email: [],
        });
    }
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log("am here");

        // navigator(location.pathname);
    }, [navigator]);
    useEffect(() => {
        if (groups) {
            setGroupList(
                groups.map((group: any) => {
                    if (chatRooms.find((r: chatRoom) => r.id == group.id)) {
                        return (
                            <div
                                className="sidebar-wrapper"
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
                                            (user: User) => user.email
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
                                        setIsDmsSection(true);
                                        setRoom(null);
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
                            <div className="sidebar-wrapper" key={group.id}>
                                <FriendCard
                                    img={roomImg}
                                    name={group.roomName}
                                    lastmsg={`${group.users.length} users`}
                                    addOption={false}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (group.status != "protected") {
                                            socket.emit("joinRoom", {
                                                roomName: group.roomName,
                                                email: [],
                                            });
                                            setRoom(room);
                                            setIsDmsSection(true);
                                        } else {
                                            setWantToJoinProtected(true);
                                            joinProtectedRoom(group.roomName);
                                        }
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
                                                email: [],
                                            });
                                            setWantToJoinProtected(false);
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
                                                autoComplete="on"
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
    }, [groups, password, wantsToJoinProtected, room, chatRooms]);
    return <>{groupList}</>;
}
