import profileImg from "../assets/ytouate.jpeg";
import MatchCard from "./MatchCard";
import img from '../assets/background_2.jpeg'
function Profile() {
    return (
        <section className="profile-page">
            <div className="content">
                <div className="profile-info-container">
                    <img src={profileImg} alt="" className="profile-img" />
                    <p className="profile-username">ytouate</p>
                </div>

                <div className="games-card">
                    <p>30 Games</p>
                </div>
                <div className="history">
                    <div className="info-card">
                        <p>15 Win</p>
                    </div>
                    <div className="info-card">
                        <p>15 Loses</p>
                    </div>
                    <div className="info-card">
                        <p>15 Win Streak</p>
                    </div>
                </div>
                <div className="history-cards">
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                </div>
                <div className="info-card">
                    <p>Account settings</p>
                </div>
            </div>
            <img  className="profile-page-img" src={img} alt="" />
        </section>
    );
}

export default Profile;
