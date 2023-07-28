
import webSocketService from "../../context/WebSocketService";
import "./CurrentChattingUser.css";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../context/Types";
export function CurrentChattingUser({
    selectedUser,
    userId,
}: {
    selectedUser: User;
    userId: number;
}) {
    const navigate = useNavigate();

    const emitInvite = (friendId: number) => {
        const socket = webSocketService.getSocket();

        socket?.emit("gameInvite", {
            userId: userId,
            friendId: friendId,
        });

        socket?.on("invite_sent", (data: any) => {
            navigate(`/challenge/${data.id}`, {
                state: { username: data.username },
            });
        });
    };

    return (
        <>
            {selectedUser && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: "20px",
                    }}
                >
                    <Link
                        className="chatting-user"
                        to={`/profile/${selectedUser.id}`}
                    >
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
                    <div>
                        <button
                            onClick={() => {
                                emitInvite(selectedUser.id);
                            }}
                            className="button"
                        >
                            challenge
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
