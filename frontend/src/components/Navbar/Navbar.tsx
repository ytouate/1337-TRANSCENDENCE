import { Link, NavLink, Outlet } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import ModeToggler from "../ModeToggler";
// import Cookies from "js-cookie";
import './Navbar.css'


type NavData = {
    profileImg: string
}
function Nav(props : NavData) {
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
