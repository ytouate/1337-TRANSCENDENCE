import { Link, useNavigate } from "react-router-dom";
import "./DropDownMenu.css";
import Cookies from "js-cookie";
import { useContext } from "react";
import { authContext, userContext } from "../../context/Context";

export default function DropDownMenup({ dropdownRef }: any) {
    const [user]: any = useContext(userContext);
    const [isSignedIn, setIsSignedIn]: any = useContext(authContext);
    const navigator = useNavigate();
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
                    <p>{user.username} </p>
                </Link>
            </li>
            <li>
                <Link to="/settings">Settings</Link>
            </li>
            <hr />
            <li>
                <a
                    onClick={() => {
                        fetch("http://localhost:3000/logout", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${Cookies.get("Token")}`,
                            },
                        }).then(() => {
                            Cookies.remove("isSignedIn");
                            Cookies.remove("Token");
                            setIsSignedIn(false);
                            navigator("/signin");
                        });
                    }}
                >
                    Logout
                </a>
            </li>
        </ul>
    );
}
