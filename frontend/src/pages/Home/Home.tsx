import GameOptions from "../../components/GameOptions/GameOptions";

import LeaderBoardCard from "../../components/LeaderBoard/LeaderBoard";
import ActiveFriends from "../../components/ActiveFriends/ActiveFriends";
import "./Home.css";
import { userContext } from "../../context/Context";

import { useLoaderData } from "react-router-dom";
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
  return await res.json();
}

function Home() {
  const user: any = useLoaderData();
  console.log(user);
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
