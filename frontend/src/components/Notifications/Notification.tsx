import './Notification.css';
import bell from '../../assets/bell.svg';
import { userContext } from '../../context/Context';
import { useState, useEffect, useContext, useRef } from 'react';
import { nanoid } from 'nanoid';
import socketIO from 'socket.io-client';
import Cookies from 'js-cookie';
import { Socket } from 'socket.io-client/debug';
import webSocketService from '../../context/WebSocketService';
import { useNavigate } from 'react-router-dom';

function acceptInvitation(socket: any, id: number) {
    socket.emit('answer_notification', {
        id: id,
        status: 'accept',
        description: 'Invitaion accepted',
    });
}

function rejectInvitation(socket: any, id: number) {
    socket.emit("answer_notification", {
        id: id,
        status: "reject",
        description: "Invitaion Rejected",
    });
}

function RequestNotification(props: any) {
    return (
        <li key={props.id} className='notification-card'>
            <div className='notification-card--data'>
                <p className='notification-card--title'>{props.title}</p>
                <p>
                    {props.status
                        ? 'request accepted from ' + props.reicever.username
                        : props.description}
                </p>
            </div>
            <div className=' notification-actions'>
                {props.title == 'Request' && !props.status && (
                    <>
                        <button
                            onClick={() => {
                                props.acceptInvitation();
                            }}
                            className='notification-card--action'
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => props.declineInvitation()}
                            className='notification-card--action'
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}

export default function Notification() {
    const [user]: any = useContext(userContext);
    const [socketContext, setSocketContext] = useState<Socket | null>(null);
    const [gameSocket, setGameSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();

    let [notifications, setNotifications] = useState<any>(user.notifications);
    const notificationsRef = useRef<any>(notifications);

    useEffect(() => {
        notificationsRef.current = notifications;
    }, [notifications]);

    // if invitation is accepted we remove the notification
    // redirect to the challenge page
    function acceptGameInvite(notif: any) {
        setNotifications((prevNotifications: any) =>
            prevNotifications.filter(
                (notification: any) =>
                    notification.id !== notif.id ||
                    notification.type !== 'game_invite',
            ),
        );
        navigate(`/challenge/${notif.id}`);
    }

    // we inform the other use that their invitation was declined
    // we remove the declined notification
    function declineGameInvite(notif: any) {
        gameSocket?.emit('declineInvitation', {
            userId: user.id,
            hostId: notif.id,
        });
        setNotifications((prevNotifications: any) =>
            prevNotifications.filter(
                (notification: any) =>
                    notification.id !== notif.id ||
                    notification.type !== 'game_invite',
            ),
        );
    }

    // since normal notifs are stored in db, and has an id
    // game invites are not stored in db so their ids is their inviter id
    // game invites has an additional attr which their type
    const gameNotifListen = (socket: any) => {
        socket.on('already_challenged', (body: any) => {
            setNotifications((prevNotifications: any) =>
                prevNotifications.filter(
                    (notification: any) =>
                        notification.id !== body.challengerId ||
                        notification.type !== 'game_invite',
                ),
            );
            navigate(`/challenge/${body.challengerId}`);
        });

        socket?.on('notif_invite_declined', (data: any) => {
            push_notif(data);
        });

        socket.on('invitation_canceled', (body: any) => {
            // the invitation is canceled,
            // we simply remove the notif
            setNotifications((prevNotifications: any) =>
                prevNotifications.filter(
                    (notification: any) =>
                        notification.id !== body.challengerId ||
                        notification.type !== 'game_invite',
                ),
            );
        });

        const push_notif = (data: any) => {
            console.log('receiving invite from ', data.username);

            const notif = {
                senderUsername: data.username,
                id: data.id,
                description: data.description,
                title: data.title,
                status: data.status,
                type: data.type,
            };

            const notificationExists = notificationsRef.current.find(
                (notification: any) =>
                    notification.id === data.id &&
                    notification.type === data.type,
            );

            if (!notificationExists)
                setNotifications((prev: any) => [...prev, notif]);
        };

        socket.on('receive_invite', (data: any) => {
            push_notif(data);
        });
    };

    useEffect(() => {
        const socket = webSocketService.connect();
        setGameSocket(socket);
        gameNotifListen(socket);

        const socketContext: any = socketIO(
            'http://localhost:3000/notification',
            {
                autoConnect: false,
                extraHeaders: {
                    Authorization: `Bearer ${Cookies.get('Token')}`,
                },
            },
        );
        socketContext.connect();
        setSocketContext(socketContext);
        socketContext.on('receive_notification', (notification: any) => {
            setNotifications((prev: any) => {
                return [...prev, notification];
            });
        });

        return () => {
            socket.off('receive_notification');
            socket.off('receive_invite');
            socket.off('already_challenged');
            socket.off('invitation_canceled');
            socket.off('notif_invite_declined');
        };
    }, []);

    const notifList = notifications.map((notification: any) => {
        if (notification.type && notification.type === 'game_invite') {
            return (
                <RequestNotification
                    key={nanoid()}
                    id={notification.id}
                    declineInvitation={() => {
                        declineGameInvite(notification);
                    }}
                    acceptInvitation={() => {
                        acceptGameInvite(notification);
                    }}
                    {...notification}
                />
            );
        } else {
            return (
                <RequestNotification
                    key={nanoid()}
                    id={notification.id}
                    declineInvitation={() => {rejectInvitation(socketContext, notification.id)}}
                    acceptInvitation={() => {
                        acceptInvitation(socketContext, notification.id);
                    }}
                    {...notification}
                />
            );
        }
    });

    return (
        <ul className='notification-drop'>
            <li className='item'>
                <img src={bell} alt='' />
                {notifications.length > 0 ? (
                    <>
                        <span className='btn__badge'>
                            {notifications.length}
                        </span>
                        <ul className='notification-content'>{notifList}</ul>
                    </>
                ) : (
                    <ul className='notification-content'>
                        <li key={'lkher'}>Not notif to show</li>
                    </ul>
                )}
            </li>
        </ul>
    );
}
