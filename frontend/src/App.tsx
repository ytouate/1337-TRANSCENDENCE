import "./App.css";
import './index.css'

import Nav from "./components/Nav";
// import Home from "./components/Home";
import Home from './pages/Home/Home'
import NotFound from "./components/NotFound";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";

import Profile from "./components/ProfileData";
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";
import img from "./assets/ytouate.jpeg";
import Leaderboard from "./components/Leaderboard";
import AccountSettings from "./components/AccountSettings";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Nav profileImg={img} />}>
            <Route index element={<Home />}></Route>
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
            {/* <Route index element={<Home />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="signin" element={<SignIn />} />
            <Route
                path="livegames"
                element={<h1>here goes the live games</h1>}
            />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="*" element={<NotFound />}></Route> */}
        </Route>
    )
);

function App() {

    return <RouterProvider router={router} />;
}

export default App;
