import './GameOption.css';

type GameOptionData = {
    img: string
    title: string
}

function GameOption(props: GameOptionData) {
    return (
        <div className="card">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="card-inner">
                <img src={props.img} alt="" />
                <button className="button">{props.title}</button>
            </div>
        </div>
    );
}

export default GameOption;
