import "./Notification.css";
import bell from "../../assets/bell.svg";
import { Fragment } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import { socketContext } from "../../context/Context";


export default function Notification() {
    let notifications: any = [];
    socketContext.on('receive_notification', (notification) => {
        console.log(notification);
    })

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
                            {notifications}
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
