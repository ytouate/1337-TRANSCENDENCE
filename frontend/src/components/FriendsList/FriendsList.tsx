import SearchBar from "../SearchBar/SearchBar";
import { userContext } from "../../context/Context";
import "./FriendsList.css";
import { Fragment, useContext, useState } from "react";
import FriendCard from "../FriendCard/FriendCard";
import Cookies from "js-cookie";
export default function FriendsList() {
  const [searchPattern, setSearchPattern] = useState("");
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
  function searchForUsers(e: any) {
    e.preventDefault();
    const token = Cookies.get("Token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `http://localhost:3000/users/search?` + new URLSearchParams({
        pattern: searchPattern
      }),
      options
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
  return (
    <div className="friends-list">
      <div className="friends-list--header">
        <SearchBar
          value={searchPattern}
          searchForUsers={searchForUsers}
          setValue={setSearchPattern}
        />
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
