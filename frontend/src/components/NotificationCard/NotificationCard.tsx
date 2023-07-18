import { useContext } from "react";
import "./NotificationCard.css";


export function NotificationCard(props: any) {
    return (
        <li className="notification-card">
            <div className="notification-card--data">
                <p className="notification-card--title">{props.title}</p>
                <p>{props.description}</p>
            </div>
            <div className=" notification-actions">
                {props.title == "Request" && (
                    // <RequestTitle socket={socket} id={props.id} />
                )}
            </div>
        </li>
    );
}
