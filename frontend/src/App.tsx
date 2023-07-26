import './App.css';
import './index.css';

import Navbar, { loader as navLoader } from './components/Navbar/Navbar.jsx';
import { authContext } from './context/Context.js';
import Home, { loader as homeLoader } from './pages/Home/Home.jsx';

import Settings, {
    loader as settingsLoader,
} from './pages/Settings/Settings.jsx';

import {
    createBrowserRouter,
    Route,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import Profile, {
    userLoader,
    ErrorBoundary,
} from './pages/Profile/Profile.jsx';
import SignIn from './pages/SignIn/SignIn.js';
import Chat from './pages/Chat/Chat';
import Cookies from 'js-cookie';
import TwoFactor from './pages/TwoFactor/TwoFactor.js';
import { useState } from 'react';
import AgainstAi from './pages/AgainstAi/AgainstAi.js';
import Queue from './pages/Queue/Queue.js';
import Challenge from './pages/Challenge/Challenge.js';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/twofactor' element={<TwoFactor />} />
            <Route path='signin' element={<SignIn />} />
            <Route path='/' loader={navLoader} element={<Navbar />}>
                <Route index loader={homeLoader} element={<Home />} />
                <Route
                    path='profile/:id'
                    errorElement={<ErrorBoundary />}
                    loader={userLoader}
                    element={<Profile />}
                />
                <Route path='chat' loader={homeLoader} element={<Chat />} />
                <Route loader={navLoader} path='ai' element={<AgainstAi />} />
                <Route loader={navLoader} path='queue' element={<Queue />} />

                <Route
                    loader={navLoader}
                    path='challenge/:hostId'
                    element={<Challenge />}
                />

                <Route
                    path='settings'
                    errorElement={<ErrorBoundary />}
                    loader={settingsLoader}
                    element={<Settings />}
                />
            </Route>
        </>,
    ),
);

function App() {
    let isSignedIn: any = Cookies.get('isSignedIn');
    if (isSignedIn && isSignedIn == 'true') isSignedIn = true;
    else isSignedIn = false;
    return (
        <authContext.Provider value={useState(isSignedIn)}>
            <RouterProvider router={router} />
        </authContext.Provider>
    );
}

export default App;
