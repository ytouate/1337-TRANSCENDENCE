import "./Notification.css";
import bell from "../../assets/bell.svg";
import { ChallengeCard } from "../ActiveFriends/ActiveFriends";
import ytouate from "../../assets/ytouate.jpeg";
import { Fragment } from "react";

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
        <p>{props.description}</p>
      </div>
      <div className=" notification-actions">
        <button className="notification-card--action">{buttonType}</button>
        {props.title != "Message" && (
          <button className="notification-card--action">Reject</button>
        )}
      </div>
    </li>
  );
}

export default function Notification(props: any) {
  let notifications = []
  if (props.notifs) {
     notifications = props.notifs.map((notif: any) => {
      return (
        <Fragment key={notif.id}>
          <NotificationCard
            title={notif.title}
            description={notif.description}
            sender={notif.sender.username}
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
        <span className="btn__badge">{notifications.length}</span>
        <ul className="notification-content">{notifications}</ul>
      </li>
    </ul>
  );
}
