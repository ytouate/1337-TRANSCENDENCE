import img from '../assets/otmallah.jpeg'
function GroupChat() {
    return ( 
        <div className="groupchat">
            <div className="groupchat-left">
                <img src={img} alt="" className="groupchat-profile" />
                <img src={img} alt="" className="groupchat-profile" />
                <img src={img} alt="" className="groupchat-profile" />
            </div>
            <div className="groupchat-data">
                <p className='groupchat-name'>group name</p>
                <p className='groupchat-lastmessage'>Hello</p>
            </div>
            <div className="message-count">

            </div>
        </div>
    );
}

export default GroupChat;