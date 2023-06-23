import profileImg from "../assets/ytouate.jpeg";
import MatchCard from "./MatchCard";
import img from "../assets/background_3.jpg";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";

function Profile() {
    function scrollWithMouse(e) {
        let pos = e.target.scrollLeft;
        e.target.scrollTo({
            top: 100,
            left: pos + 10,
            behavior: "smooth",
        });
        console.log("here");
    }
    const [emblaRef] = useEmblaCarousel();
    return (
        <section className="profile-page">
            <div className="profile-page--left">
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
                <div onWheel={scrollWithMouse} className="history-cards">
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                    <MatchCard />
                </div>
                <Link className="info-card" to="/settings">
                    <p>Account settings</p>
                </Link>
            </div>
            <div className="profile-page--right">
                <img className="profile-page-img" src={img} alt="" />
            </div>
        </section>
    );
}

export default Profile;
