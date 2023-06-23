import { useContext } from "react";
import homeImg from "../assets/home_bg.jpeg";
import robot from "../assets/play_against_ai.jpg";
import friends from "../assets/playing_against_friends.jpg";
import matchmaking from "../assets/matchmaking.jpg";
import { Link, useOutletContext } from "react-router-dom";

function Home(props) {
    return (
        <main className="home">
            <div className="left">
                <h2 className="home-text">
                    LET'S GET <br /> THE GAME BEGIN
                </h2>
                <div className="home-buttons">
                    <div className="card">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="card-inner">
                            <img src={robot} alt="" />
                            <button className="button">Play against Ai</button>
                        </div>
                    </div>
                    <div className="card">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="card-inner">
                            <img src={friends} alt="" />
                            <button className="button">Play against friends</button>
                        </div>
                    </div>
                    <div className="card">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="card-inner">
                            <img src={matchmaking} alt="" />
                            <button className="button">enter matchmaking</button>
                        </div>
                    </div>
                    {/* <button className="play-btn">Enter matchmaking</button>
                    <button className="play-btn">Play against AI</button> */}
                </div>
            </div>
            <div className="right">
                <img
                    src={homeImg}
                    alt="an animated person smashing pong ball with a pong racket"
                />
            </div>
        </main>
    );
}

export default Home;
