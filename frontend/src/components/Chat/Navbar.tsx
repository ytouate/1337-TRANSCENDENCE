import img from "../../assets/otmallah.jpeg";
function Nav() {
    return (
        <nav className="chat-nav">
            <div className="messages-nav">
                <p>Messages</p>
            </div>
            <div className="chat-navbar">
                <div className="chat-container--user-info">
                    <img
                        src={img}
                        alt=""
                        className="user-message-card--profile"
                    />
                    <div className="user-message-card--data">
                        <p className="user-message-card--username">otmallah</p>
                        <p className="user-message-card--lastmessage">Hello</p>
                    </div>
                </div>
            </div>
            <div className="friends-nav">
                <p>Friends</p>
            </div>
        </nav>
    );
}

export default Nav;
