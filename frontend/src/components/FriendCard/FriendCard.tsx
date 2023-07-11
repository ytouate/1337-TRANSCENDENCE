import img from "../../assets/ytouate.jpeg";
import optionsIcon from "../../assets/options.svg";
import "./FriendCard.css";

function FriendCard(props: any) {
  const isFriend = false;
  let items = isFriend ? ["Invite", "Block", "Chat"] : ["Add", "Block"];
  const options = items.map((option) => {
    return (
      <a key={option} href="#">
        {option}
      </a>
    );
  });
  return (
    <div className="friend-card">
      <div className="friend-card--left">
        <img src={img} alt="" className="friend-card--profile" />
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
