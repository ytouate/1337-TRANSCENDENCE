import { CurrentChattingUserProps } from "../../context/Types";
import "./CurrentChattingUser.css";
import { Link } from "react-router-dom";
export function CurrentChattingUser({
    selectedUser,
}: CurrentChattingUserProps) {
    return (
        <>
            {selectedUser && (
                <Link to={`/profile/${selectedUser.id}`} className="chatting-user">
                    <img src={selectedUser.urlImage} alt="" />
                    <div className="chatting-user-data">
                        <p>{selectedUser.username}</p>
                        <p
                            className={`chatting-user-lastmsg ${selectedUser.activitystatus
                                .toString()
                                .toLowerCase()}`}
                        >
                            {selectedUser.activitystatus}
                        </p>
                    </div>
                </Link>
            )}
        </>
    );
}
