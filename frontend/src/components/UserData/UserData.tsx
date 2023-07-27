import "./UserData.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {} from "../../context/Context";
import { useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { unblock, notifyUnblocked } from "../FriendCard/FriendCard";

async function takeAction(socket: any, action: string, username: string) {
    const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get("Token")}` },
    };
    const data = await fetch(
        `http://${import.meta.env.VITE_API_URL}/user`,
        options
    );
    const res = await data.json();
    if (action == "add") {
        socket.emit("send_notification", {
            title: "Request",
            description: `new friend request from ${res.username}`,
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
        const res = await fetch(
            `http://${import.meta.env.VITE_API_URL}/users/block`,
            options
        );
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
            `http://${import.meta.env.VITE_API_URL}/users/unfriend`,
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
const notfyAlredySent = () => {
    toast.warning("Request already sent");
};
const MainUserButtons = () => {
    return (
        <>
            <Link to="/settings">
                <button className="settings-button">Settings</button>
            </Link>
            <a
                onClick={() => {
                    Cookies.remove("Token");
                }}
            >
                <button className="settings-button logout">Logout</button>
            </a>
        </>
    );
};

const MainUserFriendsButtons = (props: any) => {
    const navigator: any = useNavigate();
    const [unfriend, setUnfriend] = useState(false);
    return (
        <>
            <a
                onClick={() =>
                    takeAction(props.socket, "unfriend", props.username).then(
                        () => {
                            setUnfriend(true);
                            navigator(location.pathname);
                        }
                    )
                }
            >
                <button onClick={notfyUnfriend} className="settings-button add">
                    {!unfriend ? "Unfriend" : "Unfriended"}
                </button>
            </a>
            <a
                onClick={() =>
                    takeAction(props.socket, "block", props.username)
                }
            >
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

const UserButtons = (props: userDataType) => {
    const [isBlockButton, setBlockButton] = useState(true);
    const [isAddButton, setIsAddButton] = useState(true);
    return (
        <>
            <a
                onClick={() => {
                    takeAction(props.socket, "add", props.username);
                    setIsAddButton(false);
                }}
            >
                <button
                    onClick={isAddButton ? notfyAdd : notfyAlredySent}
                    className="settings-button add"
                >
                    Add
                </button>
            </a>
            <a
                onClick={() => {
                    isBlockButton
                        ? takeAction(props.socket, "block", props.username)
                        : unblock(props.username);
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

interface userDataType {
    urlImage: string;
    username: string;
    me: boolean;
    friendStatus: boolean;
    socket: any;
}

export default function UserData(props: userDataType) {
    console.log("props: ", props);

    return (
        <>
            <div className="profile--userdata">
                <>
                    <img
                        className="profile--userdata-img"
                        src={props.urlImage}
                        alt=""
                    />
                    <p className="profile--userdata-name">{props.username}</p>
                </>

                <div className="profile--userdata-buttons">
                    {props.me ? (
                        <MainUserButtons />
                    ) : props.friendStatus ? (
                        <MainUserFriendsButtons {...props} />
                    ) : (
                        <UserButtons {...props} />
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
