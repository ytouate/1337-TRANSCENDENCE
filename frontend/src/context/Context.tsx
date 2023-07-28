import { createContext } from "react";
import { io } from "socket.io-client";
export const authContext : any = createContext(false);
export const userContext : any = createContext(null);
import Cookies from "js-cookie";


export const chatSocket = io(`http://${import.meta.env.VITE_API_URL}/chat`, {
    autoConnect: false,
    extraHeaders: {
        Authorization: `Bearer ${Cookies.get("Token")}`,
    },
});