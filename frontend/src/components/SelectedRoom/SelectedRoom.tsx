import roomImg from "../../assets/against_friends_img.jpg";
import { useState, useEffect } from "react";
import { chatRoom, User } from "../../context/Types";
export default function SelectedRoom({
    room,
    user,
    setManageClicked,
}: {
    room: chatRoom;
    user: User;
    setManageClicked(value: boolean): void;
}) {
    const data = room && (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: "20px",
            }}
            className="selected-room"
        >
            <div className="chatting-user">
                <img src={roomImg} alt="" />
                <div className="chatting-user-data">
                    <p>{room.roomName}</p>
                    <p>{room.users?.length} active users</p>
                </div>
            </div>
            {room.admins.find((admin) => admin == user.email) && (
                <>
                    <button
                        onClick={() => setManageClicked(true)}
                        className="button"
                        style={{ width: "fit-content" }}
                    >
                        manage users
                    </button>
                </>
            )}
        </div>
    );
    return <>{data}</>;
}
