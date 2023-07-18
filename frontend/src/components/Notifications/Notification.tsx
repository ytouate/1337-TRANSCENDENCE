import "./Notification.css";
import bell from "../../assets/bell.svg";
import { socketContext, userContext } from "../../context/Context";
import { Fragment, useState, useEffect, useContext } from "react";
import { containsClass } from "@syncfusion/ej2-base";
import Cookies from "js-cookie";
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
        status: "reject",
        description: "Invitaion accepted",
    });
}
function RequestNotification(props: any) {
    return (
        <li className="notification-card">
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
                            onClick={() => acceptInvitation(props.id)}
                            className="notification-card--action"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => {
                                rejectInvitation(props.id);
                            }}
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
    const [notifications, setNotifications] = useState<any>(user.notifications);
    return (
        <ul className="notification-drop">
            <li className="item">
                <img src={bell} alt="" />
                {notifications.length > 0 ? (
                    <>
                        <span className="btn__badge">
                            {notifications.length}
                        </span>
                        <ul className="notification-content">
                            {notifications.map((notification: any) => {
                                return (
                                    <Fragment key={notification.id}>
                                        <RequestNotification
                                            {...notification}
                                        />
                                    </Fragment>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <ul className="notification-content">
                        <li>Not notif to show</li>
                    </ul>
                )}
            </li>
        </ul>
    );
}
