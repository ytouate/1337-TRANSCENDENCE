import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Profile from "./components/Profile";
import Cookies from 'js-cookie'
import Chat from "./components/Chat/Chat";

function App() {
    return (
        <>
            <BrowserRouter>
                <Nav />
                <a href="http://localhost:3000/login">
                    <button>Sign In</button>
                </a>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                    <Route
                        path="/leaderboard"
                        element={<h1>here goes the leaderboard</h1>}
                    ></Route>
                    <Route
                        path="/live-games"
                        element={<h1>here goes the live games</h1>}
                    ></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
