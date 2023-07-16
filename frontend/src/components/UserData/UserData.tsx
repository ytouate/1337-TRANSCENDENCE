import "./UserData.css";
import { Link } from "react-router-dom";
import { userContext } from "../../context/Context";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { authContext } from "../../context/Context";
import { unblock, notifyUnblocked } from "../FriendCard/FriendCard";

async function takeAction(socket: any, action: string, username: string) {
    if (action == "add") {
        socket.emit("send_notification", {
            title: "Request",
            description: `new friend request from TOBEDONE`,
            username: username,
        });
    } else if (action == "block") {
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username }),
        };
        const res = await fetch("http://localhost:3000/users/block", options);
        if (!res.ok) throw new Error("Could not block ");
    } else if (action == "unfriend") {
        const options = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username }),
        };
        const res = await fetch(
            "http://localhost:3000/users/unfriend",
            options
        );
        if (!res.ok) throw new Error("Could not unfriend");
    }
}

const notifyBlocked = () => {
    toast.info("Blocked succefully");
};

const notfyAdd = () => {
    toast.info("Request sent succefully");
};

const notfyUnfriend = () => {
    toast.info("Unfriended succefully");
};

const MainUserButtons = () => {
    return (
        <>
            <Link to="/settings">
                <button className="settings-button">Settings</button>
            </Link>
            <Link to="/signin">
                <button className="settings-button logout">Logout</button>
            </Link>
        </>
    );
};

const MainUserFriendsButtons = ({ socket, user }: any) => {
    return (
        <>
            <a onClick={() => takeAction(socket, "unfriend", user.username)}>
                <button onClick={notfyUnfriend} className="settings-button add">
                    Unfriend
                </button>
            </a>
            <a onClick={() => takeAction(socket, "block", user.username)}>
                <button
                    onClick={notifyBlocked}
                    className="settings-button block"
                >
                    block
                </button>
                <ToastContainer
                    position="top-left"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </a>
        </>
    );
};

const UserButtons = ({ socket, user }: any) => {
    const [isBlockButton, setBlockButton] = useState(true);

    return (
        <>
            <a onClick={() => takeAction(socket, "add", user.username)}>
                <button onClick={notfyAdd} className="settings-button add">
                    Add
                </button>
            </a>
            <a
                onClick={() => {
                    isBlockButton
                        ? takeAction(socket, "block", user.username)
                        : unblock(user.username);
                    setBlockButton(!isBlockButton);
                }}
            >
                <button
                    onClick={isBlockButton ? notifyBlocked : notifyUnblocked}
                    className="settings-button block"
                >
                    {isBlockButton ? "block" : "unblock"}
                </button>
            </a>
        </>
    );
};

export default function UserData() {
    const [user, setUserData]: any = useContext(userContext);
    const socket: any = useContext(authContext);

    return (
        <>
            <div className="profile--userdata">
                {user && (
                    <>
                        <img
                            className="profile--userdata-img"
                            src={user.urlImage}
                            alt=""
                        />
                        <p className="profile--userdata-name">
                            {user.username}
                        </p>
                    </>
                )}

                <div className="profile--userdata-buttons">
                    {user.me ? (
                        <MainUserButtons />
                    ) : user.friendStatus ? (
                        <MainUserFriendsButtons socket={socket} user={user} />
                    ) : (
                        <UserButtons user={user} socket={socket} />
                    )}
                </div>

                <ToastContainer
                    position="top-left"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </>
    );
}
