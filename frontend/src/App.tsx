import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Cookies from "js-cookie";
import Chat from "./components/Chat";
import { useEffect } from "react";
import SignIn from "./components/SignIn";

function App() {
    let token = Cookies.get("Token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetch("http://localhost:3000/profil", { headers })
            .then((res) => res.json())
            .then((data) => console.log(data));
    }, []);

    return (
        <>
            <BrowserRouter>
                <Nav />
                {/* <a href="http://localhost:3000/signin">
                    <button>Sign in using 42 intra</button>
                </a> */}
                <div className="page">
                    <Routes>
                        <Route path="/signin" element={<SignIn />}></Route>
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
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;

