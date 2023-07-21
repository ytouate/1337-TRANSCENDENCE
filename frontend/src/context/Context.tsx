import { createContext } from 'react';
import socketIO from 'socket.io-client';
import Cookies from 'js-cookie';
export const authContext = createContext(false);
export const userContext = createContext(null);

export const socketContext = socketIO.connect(
    'http://localhost:3000/notification',
    {
        extraHeaders: {
            Authorization: `Bearer ${Cookies.get('Token')}`,
        },
    },
);