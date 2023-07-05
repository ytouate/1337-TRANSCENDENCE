import "./Achievements.css";
import trophiesIcon from "../../assets/trophies.svg";
export default function Achievements() {
    return (
        <div className="profile--achievements">
            <div className="profile--achievements-header">
                <img src={trophiesIcon} alt="" />
                <p>Achievements</p>
            </div>
            <div className="profile--achievements-body">
                <p>You have no achievements</p>
                <p className="span"> go conquer</p>
            </div>
        </div>
    );
}
