import "./Profile.css";
import MatchCard from "../../components/HistoryCard/HistoryCard";
import historyIcon from "../../assets/history-icon.svg";
import FriendList from "../../components/FriendsList/FriendsList";
import ytouate from "../../assets/ytouate.jpeg";
import trophiesIcon from '../../assets/trophies.svg'
import statsIcon from '../../assets/stats.svg'

const UserData = () => {
  return (
    <div className="profile--userdata">
      <img className="profile--userdata-img" src={ytouate} alt="" />
      <p className="profile--userdata-name">ytouate</p>
      <button className="settings-button">Settings</button>
    </div>
  );
};

const Statistics = () => {
  return <div className="profile--statistics"></div>;
};

const History = () => {
  return (
    <div className="profile--histroy">
      <div className="profile--history-header">
        <img src={historyIcon} alt="" />
        <p>Match History</p>
      </div>
      <div className="profile--history-matches">
        <MatchCard />
        <MatchCard />
        <MatchCard />
        <MatchCard />
      </div>
    </div>
  );
};

const Achievements = () => {
  return (<div className="profile--achievements">
    <div className="profile--achievements-header">
      <img src={trophiesIcon} alt="" />
      <p>Achievements</p>
    </div>
    <div className="profile--achievements-body">
      <p>You have no achievements
        <p className="span"> go conquer</p>
      </p>
    </div>
  </div>);
};

const ToBeDone = () => {
  return <div className="stats">
    <div className="stats--header">
      <img src={statsIcon} alt="" />
      <p>Stats</p>
    </div>
    <div className="stats--body">

      <div className="status-card">
        30 Game
      </div>
      <div className="wins-loses-rate">
        <div className="status-card">25 Win</div>
        <div className="status-card">5 Loses</div>
        <div className="status-card">80%  rate</div>
      </div>
    </div>
  </div>;
};

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
        <ToBeDone />
      </div>
    </section>
  );
}
