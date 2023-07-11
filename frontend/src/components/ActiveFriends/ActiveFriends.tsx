import "./ActiveFriends.css";
import swordsIcon from "../../assets/sword.svg";
import { userContext } from "../../context/Context.js";
import { useContext } from "react";
function ChallengeCard(props: any) {
  return (
    <div className="challenge-card">
      <img src={props.img} alt="" />
      <div className="challenge-card--data">
        <p className="challenge-card--name">{props.name}</p>
        <p className="challenge-card--status">{props.status}</p>
      </div>
      <p className="challenge-card--rate">
        <button
          className="button"
          style={{
            backgroundColor: "#f6f3eb",
            fontSize: "12px",
            color: "black",
          }}
        >
          Challenge
        </button>
      </p>
    </div>
  );
}
export default function ActiveFriends() {
  const user: any = useContext(userContext);
  const activeFriends = user.friends.map((friend) => {
    return (
      <ChallengeCard
        img={friend.img}
        name={friend.name}
        status={friend.status}
      />
    );
  });
  return (
    <div className="active-friends">
      <div className="active-friends--header">
        <img src={swordsIcon} alt="" />
        <p>Invite Friends</p>
      </div>
      <div className="active-friends--body">
        <div className="scroll-div">
          {activeFriends.length > 0 ? (
            activeFriends
          ) : (
            <div className="profile--achievements-body">
              <p>There are no online Friends currently</p>
              <p className="span"> try later </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
