import { Link } from "react-router-dom";
import "./DropDownMenu.css";
import Cookies from "js-cookie";
export default function DropDownMenup({ user, dropdownRef }: any) {
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
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${Cookies.get("Token")}`,
                            },

                        }).then(() => console.log("logged out succefully"));
                    }}
                >
                    Logout
                </a>
            </li>
        </ul>
    );
}
