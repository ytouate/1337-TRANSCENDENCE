import "./Profile.css";
import MatchCard from "../../components/HistoryCard/HistoryCard";
import historyIcon from "../../assets/history-icon.svg";
const UserData = () => {
  return <div className="profile--userdata"></div>;
};

const Statistics = () => {
  return (
    <div className="profile--statistics">
    </div>
  );
};

const History = () => {
  return <div className="profile--histroy"></div>;
};

const Achievements = () => {
  return <div className="profile--achievements"></div>;
};
const ToBeDone = () => {
  return <div className="tobedone"></div>;
};
export default function Profile() {
  return (
    <section className="profile">
      <div className="profile--left">
        <UserData />
        <Statistics />
      </div>
      <div className="profile--center">
        <History />
      </div>
      <div className="profile--right">
        <Achievements />
        <ToBeDone />
      </div>
    </section>
  );
}
