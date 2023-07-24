import { createContext } from "react";
import { io } from "socket.io-client";
export const authContext = createContext(false);
export const userContext = createContext(null);
import Cookies from "js-cookie";
// export const socketContext = io('http://localhost:3000/notification', {
//     autoConnect: false,
// });

export const chatSocket = io("http://localhost:3000/chat", {
    autoConnect: false,
    extraHeaders: {
        Authorization: `Bearer ${Cookies.get("Token")}`,
    },
});