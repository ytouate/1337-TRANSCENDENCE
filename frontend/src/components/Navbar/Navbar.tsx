import { Link, NavLink, Outlet } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import ModeToggler from "../ModeToggler";

// import Cookies from "js-cookie";
import "./Navbar.css";
import { useEffect, useRef, useState } from "react";

type NavData = {
    profileImg: string;
};
function Nav(props: NavData) {
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
    // Function to close dropdown
    const closeHoverMenu = () => {
        setMenuDropDownOpen(!isMenuDropDownOpen);
    };
    function handleClickOutside(event) {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setMenuDropDownOpen(!isMenuDropDownOpen);
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.addEventListener("mousedown", handleClickOutside);
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
                    <li className="dropdown">
                        <img
                            src={props.profileImg}
                            alt=""
                            onClick={closeHoverMenu}
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
                                    <Link to="/signin">Logout</Link>
                                </li>
                            </ul>
                        )}
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
