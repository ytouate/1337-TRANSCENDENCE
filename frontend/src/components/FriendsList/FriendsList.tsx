import SearchBar from "../SearchBar/SearchBar";
import { userContext } from "../../context/Context";
import "./FriendsList.css";
import { Fragment, useContext } from "react";
import FriendCard from "../FriendCard/FriendCard";

export default function FriendsList() {
  const user: any = useContext(userContext);
  var friendList = null;
  if (user) {
    friendList = user.friends.map((friend: any) => {
      return (
        <Fragment key={friend.id}>
          <FriendCard
            status={friend.status}
            img={friend.urlImage}
            name={friend.username}
          />
        </Fragment>
      );
    });
  }
  return (
    <div className="friends-list">
      <div className="friends-list--header">
        <SearchBar />
      </div>
      <div className="friends-list--body">
        <div className="scroll-div">
          {friendList != null && friendList.length > 0 ? (
            friendList
          ) : (
            <div className="profile--achievements-body">
              <p>You have no friends currently</p>
              <p className="span"> search for some </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
