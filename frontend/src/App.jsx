import "./App.css";
import "./index.css";

import Navbar from "./components/Navbar/Navbar";
import { authContext } from "./context/authContext.jsx";
import Home from "./pages/Home/Home";
import NotFound from "./components/NotFound";
import Cookies from "js-cookie";
import { useEffect, useState, createContext } from "react";

import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Profile from "./pages/Profile/Profile";
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";
import img from "./assets/ytouate.jpeg";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar profileImg={img} />}>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />} />
      <Route path="signin" element={<SignIn />} />
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
