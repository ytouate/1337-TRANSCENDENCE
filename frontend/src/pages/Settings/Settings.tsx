import "./Settings.css";
import ytouate from "../../assets/ytouate.jpeg";
import updateNameIcon from "../../assets/update-name.svg";
import updateAvatarIcon from "../../assets/update-avatar.svg";
import { useContext, useState } from "react";
import { authContext } from "../../context/Context";
import { Navigate } from "react-router-dom";

export default function Settings() {
  const [loggedIn, setLoggedIn] = useContext(authContext);
  const [newName, setNewName] = useState("");

  function deleteAvatar() {
    // request to the backend endpoint to delete the avatar
    // update the picture with default picture
  }

  function activate2FA(e) {
    e.preventDefault();
    // request the backend to activate 2fa
  }

  const [clicked2fa, setClicked2fa] = useState(false);
  function handleClick2fa() {
    setClicked2fa(!clicked2fa);
  }

  if (!loggedIn) return <Navigate to="/signin" />;
  return (
    <div className="settings">
      <div className="settings-top">
        <div className="settings-top-buttons">
          <button className="settings-btn" onClick={deleteAvatar}>
            Delete Avatar
          </button>
          <button onClick={handleClick2fa} className="settings-btn">
            enable 2FA
          </button>
        </div>
        {clicked2fa && (
          <form onSubmit={activate2FA} className="settings--active-2fa">
            <input
              className="name-field"
              type="email"
              placeholder="ytouate@gmail.com"
            />
            <button className="btn">Enable</button>
          </form>
        )}
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
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="name-field"
            type="text"
          />
          <button className="btn">Change</button>
        </form>
      </div>
    </div>
  );
}
