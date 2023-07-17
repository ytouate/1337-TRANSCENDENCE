import GameOptions from "../../components/GameOptions/GameOptions";

import LeaderBoardCard from "../../components/LeaderBoard/LeaderBoard";
import ActiveFriends from "../../components/ActiveFriends/ActiveFriends";
import "./Home.css";
import { authContext, userContext } from "../../context/Context";

import { Navigate, redirect, useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import Nav from "../../components/Navbar/Navbar";
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
        console.log(data.isSignedIn);
        if (data.optionalMail && !data.isSignedIn) {
            console.log("here");
            return redirect("/twofactor");
        }
        return data;
    }
    return redirect("/signin");
}

function Home() {
    const user: any = useLoaderData();
    const [isSignedIn, setIsSignedIn] = useContext(authContext);
    // if (isSignedIn == true && user.optionalMail) {
    //     useEffect(() => {
    //         setIsSignedIn(false);
    //     }, []);
    //     <Navigate to={"/twofactor"} />;
    //     // return
    // }
    if (isSignedIn == false) return <Navigate to={"/signin"} />;
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
            </div>
        </userContext.Provider>
    );
}

export default Home;