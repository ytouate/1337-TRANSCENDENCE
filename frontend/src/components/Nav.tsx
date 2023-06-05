import { Link } from "react-router-dom";
import profileImg from "../assets/ytouate.jpeg";
import logoImg from "../assets/logo.png";

function Nav() {
    return (
        <nav className="navbar">
            <Link to="/">
                <img className="logo" src={logoImg} alt="" />
            </Link>
            <ul className="navbar-list">
                <li>
                    <Link to="chat">Chat</Link>
                </li>
                <li>
                    <Link to="leaderboard">Leaderboard</Link>
                </li>
                <li>
                    <Link to="livegames">Live Games</Link>
                </li>
                <li>
                    <div className="toggle-switch">
                        <label className="switch-label">
                            <input type="checkbox" className="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                </li>
                <li>
                    <Link to="/profile">
                        <img
                            className="home-profile-img"
                            src={profileImg}
                            alt=""
                        />
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
