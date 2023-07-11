import "./App.css";
import "./index.css";

import Navbar from "./components/Navbar/Navbar.jsx";
import { authContext } from "./context/Context.js";
import Home, { loader as homeLoader } from "./pages/Home/Home.jsx";
import Settings from "./pages/Settings/Settings.jsx";

import { useState } from "react";

import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";

import Profile from "./pages/Profile/Profile.jsx";
import SignIn from "./pages/SignIn/SignIn.js";
import img from "./assets/ytouate.jpeg";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Navbar profileImg={img} />}>
            <Route
                // errorElement={<h1>Error Rendering the home page</h1>}
                index
                loader={homeLoader}
                element={<Home />}
            />
            <Route path="profile" element={<Profile />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="settings" element={<Settings />} />
        </Route>
    )
);

function App() {
    return (
        <authContext.Provider value={useState(false)}>
            <RouterProvider router={router} />
        </authContext.Provider>
    );
}

export default App;


