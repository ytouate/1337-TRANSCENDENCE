import './ActiveFriends.css';
import swordsIcon from '../../assets/sword.svg';
import { userContext } from '../../context/Context.js';
import { Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ChallengeCard from '../ChallengeCard/ChallengeCard.js';
import webSocketService from '../../context/WebSocketService.js';

export default function ActiveFriends() {
    const [user]: any = useContext(userContext);
    const activeFriends = useActiveFriends(user);
    const navigate = useNavigate();

    const emitInvite = (friendId: number) => {

        const socket = webSocketService.getSocket();
        socket?.emit('gameInvite', {
            userId: user.id,
            friendId: friendId,
        });

        socket?.on('invite_sent', (data: any) => {
            navigate(`/challenge/${data.id}`, {
                state: { username: data.username },
            });
        });
    };

    function useActiveFriends(user: any) {
        let activeFriends = [];
        if (user) {
            activeFriends = user.friends.map((friend: any) => {
                return (
                    <Fragment key={friend.id}>
                        <div
                            onClick={() => {
                                emitInvite(friend.id);
                            }}
                        >
                            <ChallengeCard
                                img={friend.urlImage}
                                name={friend.username}
                                status={friend.status}
                            />
                        </div>
                    </Fragment>
                );
            });
        }
        return activeFriends;
    }

    return (
        <div className='active-friends'>
            <div className='active-friends--header'>
                <img src={swordsIcon} alt='' />
                <p>Challenge Friends</p>
            </div>
            <div className='active-friends--body'>
                <div className='scroll-div'>
                    {activeFriends.length > 0 ? (
                        activeFriends
                    ) : (
                        <div className='profile--achievements-body'>
                            <p>There are no online Friends currently</p>
                            <p className='span'> try later </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
