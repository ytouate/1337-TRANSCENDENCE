import img from '../assets/otmallah.jpeg'
function UserMessageCard() {
    return ( 
        <div className="user-message-card">
            <img src={img} alt="" className="user-message-card--profile" />
            <div className="user-message-card--data">
                <p className='user-message-card--username'>otmallah</p>
                <p className='user-message-card--lastmessage'>Hello</p>
            </div>
            <div className="message-count">

            </div>
        </div>
    );
}

export default UserMessageCard;