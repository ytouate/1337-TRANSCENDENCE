import { Link } from "react-router-dom";
import profileImg from "../assets/ytouate.jpeg";
function Navbar() {
    return (
        <nav className="navbar">
            <Link to='/' className="logo">LOGO</Link>
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
                    <Link to="play">Play</Link>
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

export default Navbar;
