import ytouate from "../assets/ytouate.jpeg";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function ProfileHover(props) {
    return (
        <div className="profile-hover">
            <Link className="profile-hover--data" to="/profile">
                    <img src={ytouate} alt="" />
                    <p>@ytouate</p>
            </Link>
            <div className="profile-hover--options">
                <Link to="/settings">
                    <p>Settings</p>
                </Link>

                <p >Sing out</p>
            </div>
        </div>
    );
}

export default ProfileHover;
