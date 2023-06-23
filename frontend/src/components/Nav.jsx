import { Link, NavLink } from "react-router-dom";
import profileImg from "../assets/ytouate.jpeg";
import logoImg from "../assets/logo.png";
import { useState } from "react";
import ProfileHover from "./ProfileHover";
import ModeToggler from "./ModeToggler";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

function Nav(props) {
    let [userData, setUserData] = useState({});

    let token = Cookies.get("Token");
    console.log(token);
    const headers = { Authorization: `Bearer ${token}` };
    useEffect(() => {
        fetch("http://localhost:3000/user", { headers })
            .then((res) => res.json())
            .then((data) => setUserData(data));
    }, [token]);

    console.log(userData);
    let [profileHovered, setProfileHovered] = useState(false);
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/">
                        <img className="logo" src={logoImg} alt="" />
                    </Link>
                    <div className="group">
                        <svg
                            className="icon"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                        >
                            <g>
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                            </g>
                        </svg>
                        <input
                            placeholder="Search"
                            type="search"
                            className="input"
                        />
                    </div>
                </div>
                <ul className="navbar-list">
                    <li>
                        <NavLink to="chat">Chat</NavLink>
                    </li>
                    <li>
                        <NavLink to="leaderboard">Leaderboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="livegames">Streams</NavLink>
                    </li>
                    <li>
                        <ModeToggler />
                    </li>
                    <li>
                        <img
                            onClick={() => setProfileHovered((prev) => !prev)}
                            className="home-profile-img"
                            src={props.profileImg}
                            alt=""
                        />
                        {profileHovered && <ProfileHover />}
                    </li>
                </ul>
            </nav>
            <div className="page">
                <Outlet />
            </div>
        </>
    );
}

export default Nav;
