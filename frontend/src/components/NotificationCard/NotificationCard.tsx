import { useContext } from "react";
import "./NotificationCard.css";
import { authContext } from "../../context/Context";

export function NotificationCard(props: any) {
  const buttonType = props.title == "Message" ? "Reply" : "Accept";
  const socket: any = useContext(authContext);
  function acceptInvitation(e) {
    socket.emit("answer_notification", {
      id: props.id,
      status: buttonType.toLowerCase(),
    });
  }
  return (
    <li className="notification-card">
      <div className="notification-card--data">
        <p className="notification-card--title">{props.title}</p>
        <p>{props.description}</p>
      </div>
      <div className=" notification-actions">
        <button
          className="notification-card--action"
          onClick={acceptInvitation}
        >
          {buttonType}
        </button>
        {props.title != "Message" && (
          <button className="notification-card--action">Reject</button>
        )}
      </div>
    </li>
  );
}
