import "./Profile.css";
import History from "../../components/History/History";
import FriendList from "../../components/FriendsList/FriendsList";
import UserData from "../../components/UserData/UserData";
import Achievements from "../../components/Achievements/Achievements";
import Stats from "../../components/Stats/Stats";
import { useEffect, useState } from "react";
import { userContext } from "../../context/Context";
import Cookies from "js-cookie";

export default function Profile() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const Token = Cookies.get("Token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    };
    fetch("http://localhost:3000/user", options)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);
  return (
    <userContext.Provider value={user}>
      <section className="profile">
        <div className="profile--left">
          <UserData />
          <History />
        </div>
        <div className="profile--center">
          <FriendList />
        </div>
        <div className="profile--right">
          <Achievements />
          <Stats />
        </div>
      </section>
    </userContext.Provider>
  );
}
