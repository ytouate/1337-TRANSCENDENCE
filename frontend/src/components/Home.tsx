import homeImg from '../assets/home_bg.jpeg'

function Home() {
    return (
        <main className="home">
            <div className="left">
                <h2 className="home-text">LET THE <br /> GAME BEGIN</h2>
                <div className="home-buttons">
                    <button className="play-btn">Enter matchmaking</button>
                    <button className="play-btn">Play against AI</button>
                </div>
                
            </div>
            <div className="right">
                <img src={homeImg} alt="an animated person smashing pong ball with a pong racket" />
            </div>
        </main>
    );
}

export default Home;
