import "./Profile.css";
import History from "../../components/History/History";
import FriendList from "../../components/FriendsList/FriendsList";
import UserData from '../../components/UserData/UserData'
import Achievements from "../../components/Achievements/Achievements";
import Stats from "../../components/Stats/Stats";

export default function Profile() {
  return (
    <section className="profile">
      <div className="profile--left">
        <UserData />
        <History />
      </div>
      <div className="profile--center">
        <FriendList />
      </div>
      <div className="profile--right">
        <Achievements />
        <Stats />
      </div>
    </section>
  );
}
