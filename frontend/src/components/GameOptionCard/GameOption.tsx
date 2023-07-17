import "./GameOption.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
type GameOptionData = {
    img: string;
    title: string;
    type: string;
};

function GameOption(props: GameOptionData) {
    function handleClick(e, type) {
        if (type == "ai") {
            // do ai
        } else if (type == "matchmaking") {
            // matchmaking
        }
    }
    return (
        <div className="card">
            <div className="circle"></div>
            <div className="circle"></div>
            <Link
                to={props.type == "ai" ? "/ai" : "matchmaking"}
                className="card-inner"
            >
                <img src={props.img} alt="" />
                <button
                    onClick={(e) => {
                        handleClick(e, props.type);
                    }}
                    className="button"
                >
                    {props.title}
                </button>
            </Link>
        </div>
    );
}

export default GameOption;