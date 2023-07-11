import GameOptions from "../../components/GameOptions/GameOptions";

import LeaderBoardCard from "../../components/LeaderBoard/LeaderBoard";
import ActiveFriends from "../../components/ActiveFriends/ActiveFriends";
import "./Home.css";
import { authContext } from "../../context/authContext";

import { useContext, useEffect } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

export function loader() {
    return "Home data";
}

function Home() {
    useEffect(() => {
        // request
    }, [])
    const data = useLoaderData();
    const [loggedIn, setLoggedIn] = useContext(authContext);
    if (!loggedIn) return <Navigate to="/signin" replace />;
    return (
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
    );
}

export default Home;
