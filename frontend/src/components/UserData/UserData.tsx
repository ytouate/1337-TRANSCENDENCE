import "./UserData.css";
import { Link } from "react-router-dom";
import { userContext } from "../../context/Context";
import { useContext, useEffect } from "react";

export default function UserData() {
  const user: any = useContext(userContext);
  return (
    <>
      <div className="profile--userdata">
        {user && (
          <>
            <img className="profile--userdata-img" src={user.urlImage} alt="" />
            <p className="profile--userdata-name">{user.username}</p>
          </>
        )}

        <div className="profile--userdata-buttons">
          <Link to="/settings">
            <button className="settings-button">Settings</button>
          </Link>
          <Link to="/signin">
            <button className="settings-button logout">Logout</button>
          </Link>
        </div>
      </div>
    </>
  );
}
