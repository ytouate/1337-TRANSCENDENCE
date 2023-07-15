import LeftMessageCard from "../../components/LeftMessageCard";
import RightMessageCard from "../../components/RightMessageCard";
import "./Chat.css";

export default function Chat() {
  return (
    <div className="chat-wrapper">
      <div className="chat">
        <div className="chat-toggler"></div>
        <div className="chat-users"></div>
        <div className="chat-body">
          <LeftMessageCard />
          <RightMessageCard
            message="Wafeen"
            time={new Date()}
            sender="ytouate"
          />
        </div>
      </div>
    </div>
  );
}
