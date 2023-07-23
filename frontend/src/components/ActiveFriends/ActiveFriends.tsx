import './ActiveFriends.css';
import swordsIcon from '../../assets/sword.svg';
import { userContext } from '../../context/Context.js';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChallengeCard from '../ChallengeCard/ChallengeCard.js';
import webSocketService from '../../context/WebSocketService.js';

// function useActiveFriends(user: any) {
//     let activeFriends = [];
//     if (user) {
//         activeFriends = user.friends.map((friend: any) => {
//             return (
//                 <Link key={friend.id} to={`/profile/${friend.id}`}>
//                     <ChallengeCard
//                         img={friend.urlImage}
//                         name={friend.username}
//                         status={friend.status}
//                     />
//                 </Link>
//             );
//         });
//     }
//     return activeFriends;
// }

export default function ActiveFriends() {
    const [user]: any = useContext(userContext);
    const activeFriends = useActiveFriends(user);
    const [socket, setScoket] = useState<any>();

    const emitInvite = (username: string) => {
        // maybe some checks on socket
        socket.emit('gameInvite', { opponentUsername: username });
    };

    function useActiveFriends(user: any) {
        let activeFriends = [];
        if (user) {
            activeFriends = user.friends.map((friend: any) => {
                return (
                    <Fragment key={friend.id}>
                        <div
                            onClick={() => {
                                emitInvite(friend.username);
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

    useEffect(() => {
        setScoket(webSocketService.connect());

        return () => {
            webSocketService.disconnect();
            setScoket(null);
        };
    }, []);

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
