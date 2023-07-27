import { useRef, useEffect } from "react";
import './RightMessageCard.css'

export type MessageData = {
    message: string;
    time: Date;
    sender: string;
    img: string;
};
function RightMessageCard(props: MessageData) {
    const ref : any = useRef();

    useEffect(() => {
        return ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.message]);

    return (
        <div ref={ref} className="right-message-card">
            <div className="right-message-card--container">
                <div className="right-message-card--data">
                    <p className="right-message-card--sender-name">
                        {props.sender}
                    </p>
                    <p className="right-message-card--message-time">
                        {props.time.toString()}
                    </p>
                </div>
                <img
                    src={props.img}
                    alt=""
                    className="right-message-card--sender-img"
                />
            </div>

            <p className="right-message-card--message">{props.message}</p>
        </div>
    );
}

export default RightMessageCard;
