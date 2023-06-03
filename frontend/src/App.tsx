import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";



function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path='/chat' element={<h1>here goes the chat</h1>} ></Route>
                    <Route path='/leaderboard' element={<h1>here goes the leaderboard</h1>} ></Route>
                    <Route path='/live-games' element={<h1>here goes the live games</h1>} ></Route>
                    <Route path='/play' element={<h1>here goes the play</h1>} ></Route>
                    <Route path='/profile' element={<Profile />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
