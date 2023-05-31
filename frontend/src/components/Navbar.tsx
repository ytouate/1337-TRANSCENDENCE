
import profileImg from '../assets/ytouate.jpeg'
function Navbar() {
    return ( 
        <nav className="navbar">
            <div className='logo'>LOGO</div>
            <ul className="navbar-list">
                <li><a href='#'>Chat</a></li>
                <li><a href='#'>Live Games</a></li>
                <li><a href='#'>LeaderBoard</a></li>
                <li><a href='#'>Play</a></li>
                <li><img className='profile-img' src={profileImg} alt="" /></li>
            </ul>
        </nav>
    );
}

export default Navbar;