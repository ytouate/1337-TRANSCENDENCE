import ytouate from '../../assets/ytouate.jpeg'
import './UserData.css'
import { Link } from 'react-router-dom'

export default function UserData() {
    return (
        <div className="profile--userdata">
            <img className="profile--userdata-img" src={ytouate} alt="" />
            <p className="profile--userdata-name">ytouate</p>
            <Link to='/settings'>
                <button className="settings-button">Settings</button>
            </Link>
        </div>
    );
};