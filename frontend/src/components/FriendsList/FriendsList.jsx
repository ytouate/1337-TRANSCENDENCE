import SearchBar from "../SearchBar";
import "./FriendsList.css";
import FriendCard from "../FriendCard/FriendCard";
import ytouate from "../../assets/ytouate.jpeg";

export default function FriendsList() {
  return (
    <div className="friends-wrapper">
      <SearchBar />
      <div className="users">
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
        <FriendCard />
        <FriendCard />
      </div>
    </div>
  );
}
