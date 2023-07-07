import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import ModeToggler from "../ModeToggler";

// import Cookies from "js-cookie";
import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { authContext } from "../../context/authContext";

type NavData = {
    profileImg: string;
};
function Nav(props: NavData) {
    let [loggedIn, setLoggedIn] = useContext(authContext);
    let location = useLocation();
    useEffect(() => setMenuDropDownOpen(false ), [location]);
    // let [userData, setUserData] = useState({});

    // let token = Cookies.get("Token");
    // console.log(token);
    // const headers = { Authorization: `Bearer ${token}` };
    // useEffect(() => {
    //     fetch("http://localhost:3000/user", { headers })
    //         .then((res) => res.json())
    //         .then((data) => setUserData(data));
    // }, [token]);
    const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    // Function to close dropdown
    const toggle = () => {
        setMenuDropDownOpen(!isMenuDropDownOpen);
    };
    function handleClickOutside(event) {
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
        // document.removeEventListener("mousedown", handleClickOutside);
    });
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
                    {loggedIn && (
                        <li className="dropdown">
                            <img
                                src={props.profileImg}
                                alt=""
                                onClick={toggle}
                                ref={buttonRef}
                                className="home-profile-img"
                            />
                            {isMenuDropDownOpen && (
                                <ul
                                    className="profile-dropdown-content"
                                    ref={dropdownRef}
                                >
                                    <li>
                                        <Link
                                            className="profile-dropdown--userdata"
                                            to="/"
                                        >
                                            <img
                                                src={props.profileImg}
                                                className="profile-img-big"
                                                alt=""
                                            />
                                            <p>ytouate </p>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings">Settings</Link>
                                    </li>
                                    <hr />
                                    <li>
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setLoggedIn(false);
                                            }}
                                        >
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
            </nav>
            <div className="page">
                <Outlet />
            </div>
        </>
    );
}

export default Nav;
