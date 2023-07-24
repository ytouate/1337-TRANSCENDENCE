import {
    Link,
    NavLink,
    Outlet,
    useLoaderData,
    useLocation,
} from "react-router-dom";

import logoImg from "../../assets/logo.png";
import DropDownMenup from "../DropDownMenu/DropDownMenu";
import Notifications from "../Notifications/Notification";
import Cookies from "js-cookie";
import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../../context/Context";

export async function loader() {
    const data = await fetch("http://localhost:3000/user", {
        headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
        },
    });
    return await data.json();
}


function ProfileDropDown() {
    const [user]: any = useContext(userContext);
    const location = useLocation();
    const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);
    const dropdownRef: any = useRef(null);
    const buttonRef: any = useRef(null);
    const toggle = () => {
        setMenuDropDownOpen(!isMenuDropDownOpen);
    };
    useEffect(() => setMenuDropDownOpen(false), [location]);

    function handleClickOutside(event: any) {
        if (
            dropdownRef.current &&
            buttonRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !buttonRef.current.contains(event.target)
        ) {
            setMenuDropDownOpen(false);
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    return (
        <li className="dropdown">
            {user && (
                <img
                    src={user.urlImage}
                    alt=""
                    onClick={toggle}
                    ref={buttonRef}
                    className="home-profile-img"
                />
            )}
            {isMenuDropDownOpen && (
                <DropDownMenup user={user} dropdownRef={dropdownRef} />
            )}
        </li>
    );
}

function Nav() {
    const user: any = useLoaderData();
    
    return (
        <userContext.Provider value={useState(user)}>
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
                        <NavLink to={`profile/${user.id}`}>Profile</NavLink>
                    </li>
                    <Notifications />
                    <ProfileDropDown />
                </ul>
            </nav>
            <div className="page">
                <Outlet />
            </div>
        </userContext.Provider>
    );
}

export default Nav;
