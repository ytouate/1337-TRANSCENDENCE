import "./UserData.css";
import { Link } from "react-router-dom";
import { userContext } from "../../context/Context";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
export default function UserData() {
  const user: any = useContext(userContext);

  function blockUser(e: any, username: string) {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("Token")}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username': username}),
    };

    fetch("http://localhost:3000/users/block", options)
      .then(() => alert('Blocktih'))
  }
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
          {user.me ? (
            <>
              <Link to="/settings">
                <button className="settings-button">Settings</button>
              </Link>
              <Link to="/signin">
                <button className="settings-button logout">Logout</button>
              </Link>
            </>
          ) : (
            <>
              {" "}
              <Link to="/signin">
                <button className="settings-button add">Add</button>
              </Link>{" "}
              <a onClick={(e) => blockUser(e, user.username)}>
                <button className="settings-button block">block</button>
              </a>{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
}
