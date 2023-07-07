import "./Settings.css";
import ytouate from "../../assets/ytouate.jpeg";
import updateNameIcon from "../../assets/update-name.svg";
import updateAvatarIcon from "../../assets/update-avatar.svg";
import { useContext, useState } from "react";
import { authContext } from "../../context/authContext";
import { Navigate } from "react-router-dom";

export default function () {
  const [loggedIn, setLoggedIn] = useContext(authContext);
  const [clicked, setClicked] = useState(false);
  function handleClick() {
    setClicked(!clicked);
  }

  if (!loggedIn) return <Navigate to="/signin" />;
  return (
    <div className="settings">
      <div className="settings-delete-avatar">
        <button className="settings-btn">Delete Avatar</button>
        <button onClick={handleClick} className="settings-btn">
          enable 2FA
        </button>
      </div>
      <div className="settings-update-wrapper">
        <div className="settings--header">
          <img src={updateAvatarIcon} alt="" />
          <p>update avatar</p>
        </div>
        <form className="settings--update-avatar">
          <div className="settings--update-avatar-user-data">
            <img className="settings--avatar" src={ytouate} alt="" />
            <p>ytouate</p>
          </div>
          <input type="file" />
          <button className="upload-btn">Upload</button>
        </form>
      </div>
      <div className="settings-update-wrapper">
        <div className="settings--header">
          <img src={updateNameIcon} alt="" />
          <p>update name</p>
        </div>
        <form className="settings--update-name">
          <input className="name-field" type="text" />
          <button className="change-name-btn">Change</button>
        </form>
      </div>
    </div>
  );
}
