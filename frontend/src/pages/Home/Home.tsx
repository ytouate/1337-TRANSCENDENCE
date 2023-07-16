import GameOptions from "../../components/GameOptions/GameOptions";

import LeaderBoardCard from "../../components/LeaderBoard/LeaderBoard";
import ActiveFriends from "../../components/ActiveFriends/ActiveFriends";
import "./Home.css";
import { userContext } from "../../context/Context";

import { Navigate, redirect, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
export async function loader() {
  const Token = Cookies.get("Token");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  };
  const res = await fetch("http://localhost:3000/user", options);
  if (res.ok)
    return await res.json();
  return redirect('/signin');
}

function Home() {
  const user: any = useLoaderData();
  return (
    <userContext.Provider value={user} >
      <div className="home">
        <div className="home--left">
          <GameOptions />
        </div>
        <div className="home--center">
          <ActiveFriends />
        </div>
        <div className="home--right">
          <LeaderBoardCard />
        </div>
      </div>
    </userContext.Provider>
  );
}

export default Home;
