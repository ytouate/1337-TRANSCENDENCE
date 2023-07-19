import img from "../assets/otmallah.jpeg";
import { useEffect } from "react";
import { useRef } from "react";
function LeftMessageCard(props) {
    const ref = useRef();
    useEffect(() => {
        console.log('here');
        ref.current?.scrollIntoView({ behaviour: "smooth" });
    }, [props.message]);

    return (
        <div ref={ref} className="message-card">
            <div className="message-card--container">
                <img src={img} alt="" className="message-card--sender-img" />
                <div className="message-card--data">
                    <p className="message-cad--sender-name">otmallah</p>
                    <p className="message-card--message-time">5:00PM</p>
                </div>
            </div>

            <p className="message-card--message">{props.message}</p>
        </div>
    );
}

export default LeftMessageCard;
