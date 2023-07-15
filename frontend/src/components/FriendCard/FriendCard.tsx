import { useContext } from "react";
import optionsIcon from "../../assets/options.svg";
import "./FriendCard.css";
import Cookies from "js-cookie";
import { authContext } from "../../context/Context";
function FriendCard(props: any) {
  const socket: any = useContext(authContext);
  function takeAction(action: string) {
    if (action === "unblock") {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: props.name }),
      };

      fetch("http://localhost:3000/users/unblock", options).then(() =>
        alert("unblockitih")
      );
    } else if (action == "add") {
      socket.emit("send_notification", {
        title: "Request",
        description: `ytouate requested adding you`,
        username: props.name,
      });
    }
  }

  const options = props.actions.map((option: any) => {
    return (
      <span key={option} onClick={() => takeAction(option.toLowerCase())}>
        {option}
      </span>
    );
  });
  return (
    <div className="friend-card">
      <div className="friend-card--left">
        <img src={props.img} alt="" className="friend-card--profile" />
        <div className="friend-card--data">
          <p className="friend-card--username">{props.name}</p>
          <p className="friend-card--status">{props.status}</p>
        </div>
      </div>
      <div className="friend-card--manage">
        <img src={optionsIcon} alt="" />
        <div className="dropdown-content">{options}</div>
      </div>
    </div>
  );
}

export default FriendCard;
