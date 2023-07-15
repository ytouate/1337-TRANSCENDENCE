import "./App.css";
import "./index.css";

import Navbar, { loader as navLoader } from "./components/Navbar/Navbar.jsx";
import { authContext } from "./context/Context.js";
import Home, { loader as homeLoader } from "./pages/Home/Home.jsx";
import UserDetail from "./pages/UserDetail/UserDetail.js";

import Settings, {
  loader as settingsLoader,
} from "./pages/Settings/Settings.jsx";

import { useState } from "react";

import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Profile, {
  loader as ProfileLoader,
  userLoader,
} from "./pages/Profile/Profile.jsx";
import SignIn from "./pages/SignIn/SignIn.js";
import img from "./assets/ytouate.jpeg";
import Chat from "./pages/Chat/Chat";
import socketIO from "socket.io-client";
import Cookies from "js-cookie";

const socket = socketIO.connect("http://localhost:3000/notification", {
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("Token")}`,
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" loader={navLoader} element={<Navbar socket={socket} profileImg={img} />}>
      <Route
        // errorElement={<h1>Error Rendering the home page</h1>}
        index
        loader={homeLoader}
        element={<Home />}
      />
      <Route
        path="profile/:id"
        errorElement={<h1>sir 9wd</h1>}
        loader={userLoader}
        element={<Profile />}
      />
      <Route path="chat" element={<Chat />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="settings" loader={settingsLoader} element={<Settings />} />
    </Route>
  )
);

function App() {
  return (
    <authContext.Provider value={socket}>
      <RouterProvider router={router} />
    </authContext.Provider>
  );
}

export default App;
