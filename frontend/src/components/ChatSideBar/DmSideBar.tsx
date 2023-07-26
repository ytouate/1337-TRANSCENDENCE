import { Props } from "../../context/Types";
import FriendCard from "../FriendCard/FriendCard";
import "./DmSideBar.css";

export function DmSideBar({ user, setSelectedUser, createRoom }: Props) {
    const activeRooms = user.roomChat.filter((room) => {
        return room.messages.length > 0 && room.users.length == 2 && room.isDms;
    });
    return (
        <>
            {activeRooms &&
                activeRooms.map((room) => {
                    return (
                        <div key={room.id}>
                            {room.users.map((member) => {
                                if (member.id != user.id)
                                    return (
                                        <div
                                            key={member.id}
                                            onClick={() => {
                                                createRoom(member);
                                                setSelectedUser(member);
                                            }}
                                        >
                                            <FriendCard
                                                img={member.urlImage}
                                                name={member.username}
                                                lastmsg={
                                                    room.messages[
                                                        room.messages.length - 1
                                                    ]?.data
                                                }
                                                addOption={false}
                                            />
                                        </div>
                                    );
                            })}
                        </div>
                    );
                })}
        </>
    );
}
