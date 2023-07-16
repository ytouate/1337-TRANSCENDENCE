import { Link } from "react-router-dom";
import './DropDownMenu.css'
export default function DropDownMenup({ user, dropdownRef }: any) {
  return (
    <ul className="profile-dropdown-content" ref={dropdownRef}>
      <li>
        <Link className="profile-dropdown--userdata" to="/">
          {user && (
            <img src={user.urlImage} className="profile-img-big" alt="" />
          )}
          <p>ytouate </p>
        </Link>
      </li>
      <li>
        <Link to="/settings">Settings</Link>
      </li>
      <hr />
      <li>
        <Link to={"/signin"}>Logout</Link>
      </li>
    </ul>
  );
}
