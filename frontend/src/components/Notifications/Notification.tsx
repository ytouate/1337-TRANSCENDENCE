import "./Notification.css";
import bell from "../../assets/bell.svg";
import { userContext } from "../../context/Context";
import { useState, useEffect, useContext } from "react";
import { nanoid } from "nanoid";
import socketIO from "socket.io-client";
import Cookies from "js-cookie";
import { Socket } from "socket.io-client/debug";
import { ToastContainer, toast } from "react-toastify";

function acceptInvitation(socket: any, id: number) {
    socket.emit("answer_notification", {
        id: id,
        status: "accept",
        description: "Invitaion accepted",
    });
}

// function rejectInvitation(socket: any, id: number) {
//     socket.emit("answer_notification", {
//         id: id,
//         status: "reject",
//         description: "Invitaion Rejected",
//     });
// }

function RequestNotification(props: any) {
    return (
        <li key={props.id} className="notification-card">
            <div className="notification-card--data">
                <p className="notification-card--title">{props.title}</p>
                <p>
                    {props.status
                        ? "request accepted from " + props.reicever.username
                        : props.description}
                </p>
            </div>
            <div className=" notification-actions">
                {props.title == "Request" && !props.status && (
                    <>
                        <button
                            onClick={() => {
                                acceptInvitation(props.socket, props.id);
                            }}
                            className="notification-card--action"
                        >
                            Accept
                        </button>
                        <button className="notification-card--action">
                            Reject
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}

export default function Notification() {
    const [user]: any = useContext(userContext);
    const [socketContext, setSocketContext] = useState<Socket | null>(null);
    let [notifications, setNotifications] = useState<any>(user.notifications);
    useEffect(() => {
        const socketContext: any = socketIO(
            "http://localhost:3000/notification",
            {
                autoConnect: false,
                extraHeaders: {
                    Authorization: `Bearer ${Cookies.get("Token")}`,
                },
            }
        );
        socketContext.connect();
        setSocketContext(socketContext);
        socketContext.on("receive_notification", (notification: any) => {
            setNotifications((prev: any) => {
                return [...prev, notification];
            });
        });
    }, []);

    const notifList = notifications.map((notification: any) => {
        return (
            <RequestNotification
                key={nanoid()}
                socket={socketContext}
                id={notification.id}
                {...notification}
            />
        );
    });
    return (
        <ul className="notification-drop">
            <li className="item">
                <img src={bell} alt="" />
                {notifications.length > 0 ? (
                    <>
                        <span className="btn__badge">
                            {notifications.length}
                        </span>
                        <ul className="notification-content">{notifList}</ul>
                    </>
                ) : (
                    <ul className="notification-content">
                        <li key={"lkher"}>Not notif to show</li>
                    </ul>
                )}
            </li>
        </ul>
    );
}
