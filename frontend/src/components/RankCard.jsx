import img from "../assets/ytouate.jpeg";

function RankCard() {
    return (
        <div className="rank-card">
            <img src={img} alt="" className="rank-card--profile" />
            <div className="rank-card--data">
                <p className="rank-card--username">ytouate</p>
                <p className='rank-card--wins'>43 win</p>
            </div>
        </div>
    );
}

export default RankCard;
