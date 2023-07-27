import { User } from "../../context/Types";
import FriendCard from "../FriendCard/FriendCard";
import "./RoomForm.css";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

export function createGroup(
    e: any,
    socket: Socket,
    data: { roomName: string; status: string; password: string | undefined },
    members: string[]
) {
    e.preventDefault();
    socket.emit("createRoom", {
        roomName: data.roomName,
        status: data.status,
        email: members,
        password: data.password,
        isDm: false,
    });
}

function RoomFrom({ friends, socket, setCreateRoomClicked }: any) {
    const [members, setMembers] = useState<any>([]);
    function getUsers(e: any) {
        const { value, checked } = e.target;

        if (checked) setMembers((prev: any) => [...prev, value]);
        else {
            setMembers((prev: any) => {
                return prev.filter((email: string) => email != value);
            });
        }
    }

    const [data, setData] = useState({
        roomName: "",
        status: "",
        password: "",
    });

    function handleChange(e: any) {
        if (e.target.value == "protected" && e.target.name == "status")
            setIsProtected(true);
        if (e.target.value != "protected" && e.target.name == "status")
            setIsProtected(false);
        setData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    }

    const ref: any = useRef(null);
    function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
            setCreateRoomClicked(false);
        }
    }
    useEffect(() => {
        // document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mousedown", (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target))
                setCreateRoomClicked(false);
        });
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const [isProtected, setIsProtected] = useState(false);
    return (
        <form
            style={{ zIndex: "1" }}
            ref={ref}
            onSubmit={(e) => {
                createGroup(e, socket, data, members);
                setCreateRoomClicked(false);
                setData({ roomName: "", status: "", password: "" });
                setMembers([]);
            }}
            action=""
            className="room-form"
        >
            <label htmlFor="">room name:</label>
            <input
                required
                maxLength={10}
                type="text"
                name="roomName"
                className="twofactor-input"
                onChange={handleChange}
            />
            <p>Room Status: </p>
            <div className="status-field">
                <div className="status-option">
                    <input
                        required
                        onChange={handleChange}
                        type="radio"
                        id="public"
                        name="status"
                        value="public"
                    />
                      <label htmlFor="public">public</label>
                </div>
                <div className="status-option">
                    <input
                        required
                        onChange={handleChange}
                        type="radio"
                        id="private"
                        name="status"
                        value="private"
                    />
                    <label htmlFor="private">private</label>
                </div>
                <div className="status-option">
                    <input
                        required
                        onChange={handleChange}
                        type="radio"
                        id="protected"
                        name="status"
                        value="protected"
                    />
                      <label htmlFor="protected">protected</label>
                </div>
                {isProtected && (
                    <>
                        <label htmlFor="">Room password</label>
                        <input
                            required
                            maxLength={10}
                            type="password"
                            name="password"
                            autoComplete="on"
                            placeholder="XXXX"
                            className="twofactor-input"
                            onChange={handleChange}
                        />
                    </>
                )}
            </div>
            <p>Add Friends</p>
            <div className="room-form-friends-section">
                {friends.map((friend: User) => {
                    return (
                        <div key={friend.id} className="select-field">
                            <input
                                value={friend.email}
                                onChange={getUsers}
                                name="selectedUsers"
                                type="checkbox"
                            />
                            <label>
                                <FriendCard
                                    name={friend.username}
                                    img={friend.urlImage}
                                    lastmsg={friend.activitystatus}
                                    addOption={false}
                                />
                            </label>
                        </div>
                    );
                })}
            </div>
            <button className="button">Create chat room</button>
        </form>
    );
}

export default RoomFrom;
