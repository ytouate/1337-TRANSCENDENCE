import SearchBar from "../SearchBar/SearchBar";
import { userContext } from "../../context/Context";
import "./FriendsList.css";
import { Fragment, useContext, useEffect, useState } from "react";
import FriendCard from "../FriendCard/FriendCard";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import UserFriends from "../UserFriends/UserFriends";

function useFriendList(props: any) {
    let friendList = null;
    if (props.friends) {
        friendList = props.friends.map((friend: any) => {
            return (
                <Link to={`/profile/${friend.id}`} key={friend.id}>
                    <FriendCard
                        lastmsg={friend.activitystatus ? "online" : "offline"}
                        img={friend.urlImage}
                        name={friend.username}
                        addOption={false}
                    />
                </Link>
            );
        });
    }
    return friendList;
}

function useBlockedUsers(props: any) {
    let blockedUsers = null;
    if (props.blocked) {
        blockedUsers = props.blocked.map((user: any) => {
            return (
                <Fragment key={user.id}>
                    <FriendCard
                        lastmsg={user.activitystatus ? "Online" : "Offline"}
                        img={user.urlImage}
                        name={user.username}
                        addOption={true}
                    />
                </Fragment>
            );
        });
    }
    return blockedUsers;
}

interface friendListType {
    id: number;
    urlImage: string;
    username: string;
    blocked: any;
    friends: any;
}
export async function searchForUsers(e: any, searchPattern: string) {
    e.preventDefault();
    const token = Cookies.get("Token");
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await fetch(
        `http://localhost:3000/users/search?` +
            new URLSearchParams({
                pattern: searchPattern,
            }),
        options
    );
    const data = await res.json();
    return data;
}
export default function FriendsList(props: friendListType) {
    const [searchPattern, setSearchPattern] = useState("");
    const [section, setSection] = useState("friends");
    const [searchedFriends, setSearchFriends] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    let ctx: any = useContext(userContext);
    const [user, setUser] = useState(ctx);
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    };
    useEffect(() => {
        fetch("http://localhost:3000/users/" + props.id, options)
            .then((res) => res.json())
            .then((data) => setUser(data));
    }, [isSearching]);
    const friendList = useFriendList(user);
    const blockedUsers = useBlockedUsers(user);

    function handleSearch(e) {
        searchForUsers(e, searchPattern).then((data) => {
            setSearchFriends(
                data.map((friend: any) => {
                    setIsSearching(true);
                    return (
                        <Link to={`/profile/${friend.id}`} key={friend.id}>
                            <FriendCard
                                lastmsg={
                                    friend.activitystatus ? "online" : "offline"
                                }
                                addOption={false}
                                img={friend.urlImage}
                                name={friend.username}
                            />
                        </Link>
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
                            setSection("friends");
                            setIsSearching(false);
                        }}
                        style={{ fontSize: "12px" }}
                        className={section == "friends" ? "active" : ""}
                    >
                        friends
                    </a>
                    <a
                        onClick={() => {
                            setSection("blocked");
                            setIsSearching(false);
                        }}
                        style={{ fontSize: "12px" }}
                        className={section == "blocked" ? "active" : ""}
                    >
                        blocked
                    </a>
                    <a
                        onClick={() => {
                            setSection("search");
                            setIsSearching(!isSearching);
                        }}
                        style={{ fontSize: "12px" }}
                        className={section == "search" ? "active" : ""}
                    >
                        search
                    </a>
                </div>

                {isSearching && (
                    <SearchBar
                        value={searchPattern}
                        searchForUsers={handleSearch}
                        setValue={setSearchPattern}
                    />
                )}
            </div>
            <div className="friends-list--body">
                <div className="scroll-div">
                    {section == "friends" ? (
                        <UserFriends friendList={friendList} />
                    ) : section == "search" ? (
                        searchedFriends.length > 0 && searchedFriends
                    ) : blockedUsers.length > 0 ? (
                        blockedUsers
                    ) : (
                        <div className="profile--achievements-body">
                            <p>You have no blocked users</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
