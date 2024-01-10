import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Register, Login, Profile, Home, CreatePost, Navbar } from './components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './components/index.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => {
    const [token, setToken] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [userPosts, setUserPosts] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);




    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        console.log(storedToken)
        if (storedToken) {
            setToken(storedToken)
            setLoggedIn(true)
        }
    }, [])

    const setAndStoreToken = (userToken) => {
        localStorage.setItem('token', userToken)
        setToken(userToken)
        if (userToken) {
            setLoggedIn(true)
        }
        else {
            setLoggedIn(false)
        }
    }



    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <Navbar token={token} setToken={setAndStoreToken} />
                <Routes>
                    <Route path='*' element={<Home token={token} posts={posts} setPosts={setPosts} isLoading={isLoading} setIsLoading={setIsLoading} showModal={showModal} setShowModal={setShowModal}
                        loggedIn={loggedIn} />} />
                    <Route path='/login' element={<Login token={token} setToken={setAndStoreToken} />} />
                    <Route path='/register' element={<Register setToken={setAndStoreToken} />} />
                    <Route path='/profile' element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} isLoading={isLoading} setIsLoading={setIsLoading}
                        userPosts={userPosts} setUserPosts={setUserPosts} showModal={showModal} setShowModal={setShowModal} />} />
                    <Route path='/createpost' element={<CreatePost token={token} />} />
                </Routes>
            </Router>
        </ThemeProvider>
    )
}


ReactDOM.render(
    <App />,
    document.getElementById('app'),
);