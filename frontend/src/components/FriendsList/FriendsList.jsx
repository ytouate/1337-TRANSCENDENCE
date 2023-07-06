import SearchBar from "../SearchBar/SearchBar";
import "./FriendsList.css";
import FriendCard from "../FriendCard/FriendCard";

export default function FriendsList() {
    return (
        <div className="friends-list">
            <div className="friends-list--header">
                <SearchBar />
            </div>
            <div className="friends-list--body">
                <div className="scroll-div">
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
        </div>
    );
}
