import GameOptions from "../../components/GameOptions/GameOptions";

import LeaderBoardCard from "../../components/LeaderBoard/LeaderBoard";
import ActiveFriends from "../../components/ActiveFriends/ActiveFriends";
import "./Home.css";
import { authContext, userContext } from "../../context/Context";
import { Navigate, redirect, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { Spectate } from "../../components/Spectate/Spectate";
export async function loader() {
    const Token = Cookies.get("Token");
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Token}`,
        },
    };
    const res = await fetch("http://localhost:3000/user", options);
    if (res.ok) {
        const data = await res.json();
        if (data.optionalMail && !data.isSignedIn) {
            return redirect("/twofactor");
        }
        return data;
    }
    return redirect("/signin");
}


function Home() {
    const [isSignedIn]: any = useContext(authContext);
    if (isSignedIn == false) return <Navigate to={"/signin"} />;

    const user: any = useLoaderData();

    return (
        <userContext.Provider value={useState(user)}>
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
                <div className="home-buttom">
                    <Spectate />
                </div>
            </div>
        </userContext.Provider>
    );
}

export default Home;
