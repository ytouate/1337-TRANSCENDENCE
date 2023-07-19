import "./Notification.css";
import bell from "../../assets/bell.svg";
import { socketContext, userContext } from "../../context/Context";
import { Fragment, useState, useEffect, useContext } from "react";
import { nanoid } from "nanoid";

function acceptInvitation(id: number) {
    socketContext.emit("answer_notification", {
        id: id,
        status: "accept",
        description: "Invitaion accepted",
    });
}
function rejectInvitation(id: number) {
    socketContext.emit("answer_notification", {
        id: id,
        status: "accept",
        description: "Invitaion accepted",
    });
}

function RequestNotification(props: any) {
    console.log("here id", props.id);
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
                                acceptInvitation(props.id);
                                props.setUser(...props.user);
                            }}
                            className="notification-card--action"
                        >
                            Accept
                        </button>
                        <button
                            // onClick={() => rejectInvitation(props.id)}
                            className="notification-card--action"
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}
export default function Notification() {
    const [user, setUser] = useContext(userContext);
    console.log(user);
    let [notifications, setNotifications] = useState<any>(user.notifications);
    useEffect(() => {
        socketContext.on("receive_notification", (notification: any) => {
            console.log(notification);
            setNotifications((prev: any) => {
                return [...prev, notification];
            });
        });
    }, [user]);
    console.log("notfications: ", notifications);
    const notifList = notifications.map((notification: any) => {
        console.log("hre: ", notification);

        return (
            <Fragment key={nanoid()}>
                <RequestNotification
                    {...notification}
                    user={user}
                    setUser={setUser}
                />
            </Fragment>
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
