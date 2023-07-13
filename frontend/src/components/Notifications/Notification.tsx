import "./Notification.css";
import bell from "../../assets/bell.svg";
import { ChallengeCard } from "../ActiveFriends/ActiveFriends";
import ytouate from "../../assets/ytouate.jpeg";

/*

  Notifications types
    - Friend Requests
    - Game Invitations
    - Messages

*/

function NotificationCard(props: any) {
  const buttonType = props.title == "Message" ? "Reply" : "Accept";
  return (
    <li className="notification-card">
      <div className="notification-card--data">
        <p className="notification-card--title">{props.title}</p>
        <p>
          {props.sender}{" "}
          {props.title == "Request"
            ? "sent you a friend request"
            : props.title == "Message"
            ? "sent you a new message"
            : "Challenged you"}
        </p>
      </div>
      <div className="notification-actions">
        <button className="notification-card--action">{buttonType}</button>
        {props.title != "Message" && (
          <button className="notification-card--action">Reject</button>
        )}
      </div>
    </li>
  );
}
export default function Notification() {
  return (
    <ul className="notification-drop">
      <li className="item">
        <img src={bell} alt="" />
        <span className="btn__badge">4</span>
        <ul className="notification-content">
          <NotificationCard title="Request" sender="ytouate" />
          <hr />
          <NotificationCard title="Message" sender="otmallah" />
          <hr />
          <NotificationCard title="Challenge" sender="ilefhail" />
        </ul>
      </li>
    </ul>
  );
}
