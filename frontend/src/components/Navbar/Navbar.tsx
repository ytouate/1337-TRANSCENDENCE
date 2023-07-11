import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import logoImg from "../../assets/logo.png";
import ModeToggler from "../ModeToggler";

import Cookies from "js-cookie";
import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { authContext } from "../../context/Context";

type NavData = {
  profileImg: string;
};

export async function loader() {
  const data = await fetch("http://localhost:3000/user", {
    headers: {
      Authorization: `Bearer ${Cookies.get("Token")}`,
    },
  });
  return await data.json();
}

function Nav(props: NavData) {
  const user: any = useLoaderData();
  let [loggedIn, setLoggedIn] = useContext(authContext);
  let location = useLocation();
  useEffect(() => setMenuDropDownOpen(false), [location]);
  const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);
  const dropdownRef: any = useRef(null);
  const buttonRef: any = useRef(null);
  const toggle = () => {
    setMenuDropDownOpen(!isMenuDropDownOpen);
  };
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

  useEffect(() => {});
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
              <ul className="profile-dropdown-content" ref={dropdownRef}>
                <li>
                  <Link className="profile-dropdown--userdata" to="/">
                    {user && (
                      <img
                        src={user.urlImage}
                        className="profile-img-big"
                        alt=""
                      />
                    )}

                    <p>ytouate </p>
                  </Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <hr />
                <li>
                  <Link
                    to={'/signin'}
                    
                  >
                    Logout
                  </Link>
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
