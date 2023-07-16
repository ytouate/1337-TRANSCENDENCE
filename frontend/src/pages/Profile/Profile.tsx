import "./Profile.css";
import History from "../../components/History/History";
import FriendList from "../../components/FriendsList/FriendsList";
import UserData from "../../components/UserData/UserData";
import Achievements from "../../components/Achievements/Achievements";
import Stats from "../../components/Stats/Stats";
import { authContext, userContext } from "../../context/Context";
import Cookies from "js-cookie";
import { redirect, useLoaderData } from "react-router-dom";
import { useContext } from "react";

export async function userLoader({ params }: any) {
  const Token = Cookies.get("Token");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };
  const res = await fetch("http://localhost:3000/users/" + params.id, options);
  if (res.ok) return await res.json();
  else {
    if (res.status == 404) redirect('/signin');
    if (res.status == 401) throw new Error("Unauthorized access")
  }
}

export default function Profile() {
  const user: any = useLoaderData();
  const socket = useContext(authContext);
  
  return (
    <userContext.Provider value={user}>
      <section className="profile">
        <div className="profile--left">
          <UserData />
          <History />
        </div>
        <div className="profile--center">{user.me && <FriendList />}</div>
        <div className="profile--right">
          <Achievements />
          <Stats wins={user.win} losses={user.loss} />
        </div>
      </section>
    </userContext.Provider>
  );
}
