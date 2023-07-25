import "./GameOption.css";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
type GameOptionData = {
    img: string;
    title: string;
    type: string;
};

function GameOption(props: GameOptionData) {
    return (
        <div className="card">
            <div className="circle"></div>
            <div className="circle"></div>
            <Link
                to={props.type == "ai" ? "/ai" : "/queue"}
                className="card-inner"
            >
                <img src={props.img} alt="" />
                <button
                    // onClick={(e) => {
                    //     handleClick(e, props.type);
                    // }}
                    className="button"
                >
                    {props.title}
                </button>
            </Link>
        </div>
    );
}

export default GameOption;
