import img from "../../assets/ytouate.jpeg";
import optionsIcon from "../../assets/options.svg";
import { enableRipple } from "@syncfusion/ej2-base";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import "./FriendCard.css";

function FriendCard() {
    const isFriend = true;
  let items = isFriend ? ['Invite', 'Block', 'Chat'] : ['Add', 'Block']
  const options = items.map(option => {
    return (
        <a key={option} href="#">{option}</a>
    )
  })
  return (
    <div className="friend-card">
      <div className="friend-card--left">
        <img src={img} alt="" className="friend-card--profile" />
        <div className="friend-card--data">
          <p className="friend-card--username">ytouate</p>
          <p className="friend-card--status">Online</p>
        </div>
      </div>
      <div className="friend-card--manage">
        <img src={optionsIcon} alt="" />
        <div className="dropdown-content">
          {options}
        </div>
      </div>
    </div>
  );
}

export default FriendCard;
