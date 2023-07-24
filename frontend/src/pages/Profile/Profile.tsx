import "./Profile.css";
import History from "../../components/History/History";
import FriendList from "../../components/FriendsList/FriendsList";
import UserData from "../../components/UserData/UserData";
import Achievements from "../../components/Achievements/Achievements";
import Stats from "../../components/Stats/Stats";
import { authContext } from "../../context/Context";
import Cookies from "js-cookie";
import { Navigate, useLoaderData, useRouteError } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import socketIO from "socket.io-client";
import NotFound from "../../components/NotFound";
import { Socket } from "socket.io-client/debug";
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
    const [isSignedIn]: any = useContext(authContext);
    if (!isSignedIn) return <Navigate to={"/signin"} />;
    if (user.optionalMail && user.isSignedIn == false)
        return <Navigate to={"/twofactor"} />;

    const [socketContext, setSocketContext] = useState<Socket | any>(null);
    useEffect(() => {
        const socketContext = socketIO("http://localhost:3000/notification", {
            extraHeaders: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
            },
            autoConnect: false,
        });
        socketContext.connect();
        setSocketContext(socketContext);
    }, []);
    return (
        <section className="profile">
            <div className="profile--left">
                <UserData
                    urlImage={user.urlImage}
                    username={user.username}
                    me={user.me}
                    friendStatus={user.friendStatus}
                    socket={socketContext}
                />
                <History />
            </div>
            <div className="profile--center">
                {user.me && (
                    <FriendList
                        blocked={user.blocked}
                        friends={user.friends}
                        urlImage={user.urlImage}
                        id={user.id}
                        username={user.username}
                    />
                )}
            </div>
            <div className="profile--right">
                <Achievements />
                <Stats
                    winRate={user.winRate}
                    wins={user.win}
                    losses={user.loss}
                />
            </div>
        </section>
    );
}
