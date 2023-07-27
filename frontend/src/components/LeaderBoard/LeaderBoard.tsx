import "./LeaderBoard.css";
import leaderboardIcon from "../../assets/leaderboard-icon.svg";
import { Fragment, useEffect, useState } from "react";
import Cookies from "js-cookie";
interface leaderBoardType {
    username: string;
    urlImage: string;
    winRate: number;
}
function LeaderBoardCard(props: leaderBoardType) {
    return (
        <div className="leaderboard-card">
            <img src={props.urlImage} alt="" />
            <p className="leaderboard-card--name">{props.username}</p>
            <p className="leaderboard-card--rate">
                {props.winRate}
                <span>%</span>
            </p>
        </div>
    );
}
function LeaderBoard() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${Cookies.get("Token")}`,
            },
        };
        fetch(
            `http://${import.meta.env.VITE_API_URL}/user/leaderboard`,
            options
        )
            .then((res) => res.json())
            .then((data) => setUsers(Object.values(data)));
    }, []);

    const leaderboardList = users.map((user: any) => {
        return (
            <Fragment key={user.id}>
                <LeaderBoardCard
                    username={user.username}
                    urlImage={user.urlImage}
                    winRate={user.winRate}
                />
            </Fragment>
        );
    });
    return (
        <div className="leaderboard">
            <div className="leaderboard--header">
                <img src={leaderboardIcon} alt="" />
                <h3>Leaderboard</h3>
            </div>
            <div className="leaderboard--body">
                <div className="scroll-div">{leaderboardList}</div>
            </div>
        </div>
    );
}

export default LeaderBoard;
