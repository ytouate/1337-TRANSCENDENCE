import { useEffect, useRef, useState } from "react";
import { User, chatRoom } from "../../context/Types";
import FriendCard from "../FriendCard/FriendCard";
import "./ManageRoom.css";
import Cookies from "js-cookie";
function ToCards({
    users,
    getUsers,
}: {
    users: User[];
    getUsers(e: any): void;
}) {
    return users.map((friend: User) => {
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
                        lastmsg={friend.activitystatus.toString()}
                        addOption={false}
                    />
                </label>
            </div>
        );
    });
}

{
    /* <input
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        type="text"
                    />
                    <button
                        onClick={(e) => {
                            const options = {
                                method: "PUT",
                                headers: {
                                    Authorization: `Bearer ${Cookies.get(
                                        "Token"
                                    )}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    roomName: currentRoom.roomName,
                                    password: password,
                                }),
                            };
                            fetch(
                                "http://import.meta.env.VITE_API_URL/user/changePassword",
                                options
                            )
                                .then((res) => res.json())
                                .then((data) =>
                                    console.log("succefully deleted: ", data)
                                );
                        }}
                        className="button"
                    >
                        change
                    </button> */
}
export function ManageRoom({
    setManageClicked,
    handleOptionChange,
    takeAction,
    room,
    getUsers,
    option,
    user,
}: {
    user: User;
    handleOptionChange(option: React.ChangeEvent<HTMLInputElement>): void;
    room: chatRoom;
    option: string;
    takeAction(e: any): void;
    getUsers(event: any): void;
    setManageClicked(value: boolean): void;
}) {
    function handleClickOutside(e: any) {
        if (!formRef.current?.contains(e.target)) setManageClicked(false);
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
    const formRef: any = useRef(null);

    const allMembers = room.users.filter((member) => member.id != user.id);

    const mutedMembers = allMembers.filter((member) => {
        if (room.muteUsers.find((userMail) => userMail == member.email))
            return true;
        return false;
    });

    const unMutedMemebers = allMembers.filter((member) => {
        if (room.muteUsers.find((userMail) => userMail == member.email))
            return false;
        return true;
    });

    const nonAdminsMembers = allMembers.filter((member) => {
        if (room.admins.find((admin) => admin == member.email)) return false;
        return true;
    });
    const nonMembers = user.friends.filter((friend) => {
        if (room.users.find((member) => member.email == friend.email))
            return false;
        return true;
    });
    const radioButtons = [
        "kick",
        "ban",
        "mute",
        "unmute",
        "add-admins",
        "invite",
    ];
    const radioButtonsList = radioButtons.map((button) => {
        return (
            <div key={button} className="status-option">
                <input
                    required
                    onChange={(e) => handleOptionChange(e)}
                    type="radio"
                    id={button}
                    value={button}
                    name="action"
                />
                  <label htmlFor={button}>{button}</label>
            </div>
        );
    });
    const deletePassword = () => {
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
            },
            body: JSON.stringify({
                roomName: room.roomName,
            }),
        };
        fetch(
            `http://${import.meta.env.VITE_API_URL}/user/deletePassword`,
            options
        )
            .then((res) => res.json())
            .then((data) => console.log("succefully deleted: ", data));
    };
    const [newPassword, setNewPassword] = useState("");
    const changePassword = () => {
        const options = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomName: room.roomName,
                password: newPassword,
            }),
        };
        fetch(
            `http://${import.meta.env.VITE_API_URL}/user/changePassword`,
            options
        )
            .then((res) => res.json())
            .then((data) => console.log("succefully deleted: ", data));
    };
    return (
        <div className="manage-form">
            <form
                ref={formRef}
                onSubmit={(e) => takeAction(e)}
                className="room-form"
            >
                {room.status == "protected" && (
                    <>
                        <div className="protected-options">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    deletePassword();
                                }}
                                className="button"
                                style={{ width: "fit-content" }}
                            >
                                delete password
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                                className="button"
                                style={{ width: "fit-content" }}
                            >
                                change password
                            </button>
                        </div>
                        <div className="protecte-change-password">
                            <input
                                className="twofactor-input"
                                autoComplete="on"
                                placeholder="new password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    changePassword();
                                }}
                                className="button"
                            >
                                Change
                            </button>
                        </div>
                    </>
                )}
                <div className="status-field">{radioButtonsList}</div>
                <p>Choose Members</p>
                <div className="room-form-friends-section">
                    {option != "mute" &&
                        option != "unmute" &&
                        option != "add-admins" &&
                        option != "invite" && (
                            <ToCards users={allMembers} getUsers={getUsers} />
                        )}
                    {option == "invite" && (
                        <ToCards users={nonMembers} getUsers={getUsers} />
                    )}
                    {option == "add-admins" && (
                        <ToCards users={nonAdminsMembers} getUsers={getUsers} />
                    )}
                    {option == "mute" && (
                        <ToCards users={unMutedMemebers} getUsers={getUsers} />
                    )}
                    {option == "unmute" && (
                        <ToCards users={mutedMembers} getUsers={getUsers} />
                    )}
                </div>
                <button type="submit" className="button">
                    submit
                </button>
            </form>
        </div>
    );
}
