import "./Notification.css";
import bell from '../../assets/bell.svg'
export default function Notification() {
  return (
    // <li>
    <ul className="notification-drop">
      <li className="item">
        <img src={bell} alt="" />
        <span className="btn__badge">4</span>
        <ul className='notification-content'>
          <li className='notification-card'>First Item</li>
          <li className='notification-card'>First Item</li>
          <li className='notification-card'>First Item</li>
        </ul>
      </li>
    </ul>
    // </li>
  );
}
