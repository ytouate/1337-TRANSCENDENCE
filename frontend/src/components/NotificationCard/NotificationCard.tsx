import { useContext } from "react";
import "./NotificationCard.css";
import { authContext } from "../../context/Context";

function RequestTitle({ socket, id }: any) {
    return (
        <>
            <button
                onClick={() => acceptInvitation(socket, id)}
                className="notification-card--action"
            >
                Accept
            </button>
            <button className="notification-card--action">Reject</button>
        </>
    );
}

function acceptInvitation(socket: any, id: number) {
    socket.emit("answer_notification", {
        id: id,
        status: "accept",
        description: 'Invitaion accepted',
    });
}
export function NotificationCard(props: any) {
    const socket: any = useContext(authContext);
    console.log('notif li wsslat: ', props.notif)
    return (
        <li className="notification-card">
            <div className="notification-card--data">
                <p className="notification-card--title">{props.title}</p>
                <p>{props.description}</p>
            </div>
            <div className=" notification-actions">
                {props.title == "Request" && (
                    <RequestTitle socket={socket} id={props.id} />
                )}
            </div>
        </li>
    );
}
