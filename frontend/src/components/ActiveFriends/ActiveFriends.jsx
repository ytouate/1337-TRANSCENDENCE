import "./ActiveFriends.css";
import swordsIcon from "../../assets/sword.svg";
import FriendCard from "../FriendCard/FriendCard";
export default function ActiveFriends() {
  return (
    <div className="active-friends">
      <div className="active-friends--header">
        <img src={swordsIcon} alt="" />
        <p>Invite Friends</p>
      </div>
      <div className="active-friends--body">
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
      </div>
    </div>
  );
}
