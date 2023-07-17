
import History from "../../components/History/History";
import FriendList from "../../components/FriendsList/FriendsList";
import UserData from "../../components/UserData/UserData";
import Achievements from "../../components/Achievements/Achievements";
import Stats from "../../components/Stats/Stats";
import { userContext } from "../../context/Context";
import Cookies from "js-cookie";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";

export async function userLoader({ params }: any) {
  const Token = Cookies.get("Token");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };
  const res = await fetch("http://localhost:3000/users/", options);
  return await res.json();
}

export async function loader() {
  const Token = Cookies.get("Token");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };
  const res = await fetch("http://localhost:3000/user", options);
  return await res.json();
}

export default function Profile() {
  const user: any = useLoaderData();
  return (
    <userContext.Provider value={useState(user)}>
      <section className="profile">
        <div className="profile--left">
          <UserData />
          <History />
        </div>
        <div className="profile--center">
          {/* <FriendList /> */}
        </div>
        <div className="profile--right">
          <Achievements />
          <Stats />
        </div>
      </section>
    </userContext.Provider>
  );
}