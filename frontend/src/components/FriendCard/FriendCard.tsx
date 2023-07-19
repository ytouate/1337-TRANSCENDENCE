import "./FriendCard.css";
import optionsIcon from "../../assets/options.svg";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

export async function unblock(username: string) {
    const options = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${Cookies.get("Token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
    };

    const res = await fetch("http://localhost:3000/users/unblock", options);
    if (!res.ok) throw new Error("failed to unblock");
}
export const notifyUnblocked = () => toast("unblocked succefully");
interface friendCardType {
    img: string;
    name: string;
    lastmsg: string | null;
}
function FriendCard(props: friendCardType) {
    return (
        <>
            <div className="friend-card">
                <div className="friend-card--left">
                    <img
                        src={props.img}
                        alt=""
                        className="friend-card--profile"
                    />
                    <div className="friend-card--data">
                        <p className="friend-card--username">{props.name}</p>
                        <p className="friend-card--status">{props.lastmsg}</p>
                    </div>
                </div>
                {props.addOption && (
                    <>
                        <div className="friend-card--manage">
                            <img src={optionsIcon} alt="" />
                            <div className="dropdown-content">
                                <a onClick={notifyUnblocked}>
                                    <span onClick={() => unblock(props.name)}>
                                        unblock
                                    </span>
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <ToastContainer
                position="top-left"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

export default FriendCard;
