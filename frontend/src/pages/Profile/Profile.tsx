import "./Profile.css";
import History from "../../components/History/History";
import FriendList from "../../components/FriendsList/FriendsList";
import UserData from "../../components/UserData/UserData";
import Achievements from "../../components/Achievements/Achievements";
import Stats from "../../components/Stats/Stats";
import { authContext, userContext } from "../../context/Context";
import Cookies from "js-cookie";
import {
    Navigate,
    redirect,
    useLoaderData,
    useRouteError,
} from "react-router-dom";
import { useContext, useState } from "react";
import NotFound from "../../components/NotFound";
import Nav from "../../components/Navbar/Navbar";

export function ErrorBoundary() {
    let error: any = useRouteError();
    return <NotFound message={error.message} />;
}

export async function userLoader({ params }: any) {
    const Token = Cookies.get("Token");
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Token}`,
        },
    };
    const res = await fetch(
        "http://localhost:3000/users/" + params.id,
        options
    );
    if (res.ok) return await res.json();
    else {
        if (res.status == 404) throw new Error("Page Not Found");
        if (res.status == 401) throw new Error("Unauthorized access");
    }
}

export default function Profile() {
    const user: any = useLoaderData();
    console.log('profile user coming from loader: ', user);
    const [isSignedIn, setIsSignedIn] = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;
    if (user.optionalMail &&  user.isSignedIn == false) return <Navigate to={'/twofactor'} />
    // const socket = useContext(authContext);

    return (
        <userContext.Provider value={useState(user)}>
            <section className="profile">
                <div className="profile--left">
                    <UserData />
                    <History />
                </div>
                <div className="profile--center">
                    {user.me && <FriendList />}
                </div>
                <div className="profile--right">
                    <Achievements />
                    <Stats wins={user.win} losses={user.loss} />
                </div>
            </section>
        </userContext.Provider>
    );
}
