import SearchBar from "../SearchBar";
import "./FriendsList.css";
import FriendCard from "../FriendCard/FriendCard";
import ytouate from "../../assets/ytouate.jpeg";

export default function FriendsList() {
  return (
    <article className="friends-group">
      <SearchBar />
      <div className="users">
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
        <FriendCard />
      </div>
    </article>
  );
}
