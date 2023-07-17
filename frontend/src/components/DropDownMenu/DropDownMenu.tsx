import { Link, Navigate } from "react-router-dom";
import "./DropDownMenu.css";
import Cookies from "js-cookie";
import { useContext } from "react";
import { authContext, userContext } from "../../context/Context";

export default function DropDownMenup({ dropdownRef }: any) {
    const [user, setUser] = useContext(userContext);
    const [isSignedIn, setIsSignedIn] = useContext(authContext);
    // if (user.isSignedIn == false) return <Navigate to="/signin" />;
    return (
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
                <a
                    onClick={(e) => {
                        fetch("http://localhost:3000/logout", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${Cookies.get("Token")}`,
                            },
                        }).then(() => {
                            Cookies.remove('isSignedIn');
                            Cookies.remove('Token');
                            setIsSignedIn(false);
                        });
                    }}
                >
                    Logout
                </a>
            </li>
        </ul>
    );
}
