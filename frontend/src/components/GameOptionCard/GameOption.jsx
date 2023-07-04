import './GameOption.css';

function GameOption(props) {
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
