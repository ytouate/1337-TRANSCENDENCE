import { useEffect } from "react";
import { useRef } from "react";
import { MessageData } from "../RightMessageCard/RightMessageCard";

function LeftMessageCard(props: MessageData) {
    const ref: any = useRef(null);
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.message]);

    return (
        <div ref={ref} className="message-card">
            <div className="message-card--container">
                <img
                    src={props.img}
                    alt=""
                    className="message-card--sender-img"
                />
                <div className="message-card--data">
                    <p className="message-cad--sender-name">{props.sender}</p>
                    <p className="message-card--message-time">
                        {props.time.toString()}
                    </p>
                </div>
            </div>

            <p className="message-card--message">{props.message}</p>
        </div>
    );
}

export default LeftMessageCard;
