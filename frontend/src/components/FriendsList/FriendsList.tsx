import SearchBar from "../SearchBar/SearchBar";
import { authContext, userContext } from "../../context/Context";
import "./FriendsList.css";
import { Fragment, useContext, useState } from "react";
import FriendCard from "../FriendCard/FriendCard";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

export function MyFriends(props: any) {
  return (
    <>
      {props.friendList && props.friendList.length > 0 ? (
        props.friendList
      ) : (
        <div className="profile--achievements-body">
          <p>You have no friends currently</p>
          <p className="span"> search for some </p>
        </div>
      )}
    </>
  );
}

export function SearchedUsers(props: any) {
  return <>{props.searchedFriends.length > 0 && props.searchedFriends}</>;
}

export default function FriendsList() {
  const [searchPattern, setSearchPattern] = useState("");
  const [section, setSeaction] = useState("friends");
  const user: any = useContext(userContext);
  let friendList = null;
  if (user && user.friends) {
    friendList = user.friends.map((friend: any) => {
      return (
        <Link to={`/profile/${friend.id}`} key={friend.id}>
          <FriendCard
            actions={["Unfriend", "Chat", "Block"]}
            status={friend.status}
            img={friend.urlImage}
            name={friend.username}
          />
        </Link>
      );
    });
  }
  let blockedUsers = null;
  if (user && user.blocked) {
    blockedUsers = user.blocked.map((user: any) => {
      return (
        <Fragment key={user.id}>
          <FriendCard
            actions={["Unblock"]}
            img={user.urlImage}
            name={user.username}
          />
        </Fragment>
      );
    });
  }
  const [searchedFriends, setSearchFriends] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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
      `http://localhost:3000/users/search?` +
        new URLSearchParams({
          pattern: searchPattern,
        }),
      options
    )
      .then((res) => res.json())
      .then((data) => {
        setSearchFriends(
          data.map((friend: any) => {
            setIsSearching(true);
            return (
              <Fragment key={friend.id}>
                <FriendCard
                  id={friend.id}
                  actions={["Add", "Block"]}
                  status={friend.status}
                  img={friend.urlImage}
                  name={friend.username}
                />
              </Fragment>
            );
          })
        );
      });
  }

  return (
    <div className="friends-list">
      <div className="friends-list--header">
        <div className="friends-list-nav">
          <a
            onClick={() => {
              setSeaction("friends");
              setIsSearching(false);
            }}
            style={{ fontSize: "12px" }}
          >
            friends{" "}
          </a>
          <a
            onClick={() => {
              setSeaction("blokced");
              setIsSearching(false);
            }}
            style={{ fontSize: "12px" }}
          >
            blocked friends{" "}
          </a>
          <a
            onClick={() => {
              setSeaction("search");
              setIsSearching(!isSearching);
            }}
            style={{ fontSize: "12px" }}
          >
            search for users{" "}
          </a>
        </div>

        {isSearching && (
          <SearchBar
            value={searchPattern}
            searchForUsers={searchForUsers}
            setValue={setSearchPattern}
          />
        )}
      </div>
      <div className="friends-list--body">
        <div className="scroll-div">
          {section == "friends" ? (
            <MyFriends friendList={friendList} />
          ) : section == "search" ? (
            <SearchedUsers
              searchedFriends={searchedFriends}
              backToMyFriends={() => setIsSearching(false)}
            />
          ) : (
            blockedUsers
          )}
        </div>
      </div>
    </div>
  );
}
