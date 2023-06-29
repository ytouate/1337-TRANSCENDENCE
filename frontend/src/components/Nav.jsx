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
    // let [userData, setUserData] = useState({});

    // let token = Cookies.get("Token");
    // console.log(token);
    // const headers = { Authorization: `Bearer ${token}` };
    // useEffect(() => {
    //     fetch("http://localhost:3000/user", { headers })
    //         .then((res) => res.json())
    //         .then((data) => setUserData(data));
    // }, [token]);
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/">
                        <img className="logo" src={logoImg} alt="" />
                    </Link>
                    
                </div>
                <ul className="navbar-list">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="chat">Chat</NavLink>
                    </li>
                    <li>
                        <NavLink to="profile">Profile</NavLink>
                    </li>
                    <li>
                        <ModeToggler />
                    </li>
                    <li>
                        <img
                            className="home-profile-img"
                            src={props.profileImg}
                            alt=""
                        />
                        {/* {profileHovered && <ProfileHover />} */}
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
