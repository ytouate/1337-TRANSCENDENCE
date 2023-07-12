import "./App.css";
import "./index.css";

import Navbar, { loader as navLoader } from "./components/Navbar/Navbar.jsx";
import { authContext } from "./context/Context.js";
import Home, { loader as homeLoader } from "./pages/Home/Home.jsx";
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

import Profile, { loader as ProfileLoader } from "./pages/Profile/Profile.jsx";
import SignIn from "./pages/SignIn/SignIn.js";
import img from "./assets/ytouate.jpeg";
import Chat from './pages/Chat/Chat'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/"  loader={navLoader} element={<Navbar profileImg={img} />}>
      <Route
        // errorElement={<h1>Error Rendering the home page</h1>}
        index
        loader={homeLoader}
        element={<Home />}
      />
      <Route path="profile" loader={ProfileLoader} element={<Profile />} />
      <Route path="chat"  element={<Chat />} />
      <Route path="signin"  element={<SignIn />} />
      <Route path="settings" loader={settingsLoader} element={<Settings />} />
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
