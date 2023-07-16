import "./Notification.css";
import bell from "../../assets/bell.svg";
import { Fragment } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";

export default function Notification(props: any) {
    let notifications = [];
    if (props.notifs) {
        notifications = props.notifs.map((notif: any) => {
            console.log(notif);
            return (
                <Fragment key={notif.id}>
                    <NotificationCard
                        notif={notif}
                        actions={["add"]}
                        id={notif.id}
                        title={notif.title}
                        description={notif.description}
                    />
                    <hr />
                </Fragment>
            );
        });
    }

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
