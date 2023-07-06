import "./Profile.css";
import History from "../../components/History/History";
import FriendList from "../../components/FriendsList/FriendsList";
import UserData from "../../components/UserData/UserData";
import Achievements from "../../components/Achievements/Achievements";
import Stats from "../../components/Stats/Stats";
import { useContext } from "react";
import { authContext } from "../../context/authContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
    let [loggedIn, setLoggedIn] = useContext(authContext);
    if (!loggedIn) return <Navigate to="/signin" replace={true} />;
    return (
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
    );
}
