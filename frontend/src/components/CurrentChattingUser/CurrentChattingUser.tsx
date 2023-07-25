import { CurrentChattingUserProps } from "../../context/Types";
import './CurrentChattingUser.css'

export function CurrentChattingUser({
    selectedUser,
}: CurrentChattingUserProps) {
    return (
        <>
            {selectedUser && (
                <div className="chatting-user">
                    <img src={selectedUser.urlImage} alt="" />
                    <div className="chatting-user-data">
                        <p>{selectedUser.username}</p>
                        <p
                            className={
                                selectedUser.activitystatus
                                    ? "chatting-user-lastmsg online"
                                    : "chatting-user-lastmsg"
                            }
                        >
                            {selectedUser.activitystatus ? "Online" : "offline"}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
