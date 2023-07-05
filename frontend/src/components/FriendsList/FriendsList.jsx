import SearchBar from "../SearchBar/SearchBar";
import "./FriendsList.css";
import FriendCard from "../FriendCard/FriendCard";

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
