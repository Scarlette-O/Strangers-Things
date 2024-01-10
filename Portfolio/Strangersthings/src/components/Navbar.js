import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';


const Navbar = ({ token, setToken }) => {
    const navigate = useNavigate()

    const logout = () => {
        setToken('')
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (

        <nav className="navbar">
            <h1 className="site-title">Stranger's Things!</h1>
            {token ? (
                <>
                    <Link to='/' className="navbar-link-home">
                        Home
                    </Link>
                    <Link to='/profile' className="navbar-link-profile">
                        Profile
                    </Link>
                    <Link to='/createpost' className="navbar-link-createpost">
                        CreatePost
                    </Link>
                    <Button variant={'outlined'} onClick={logout} className="navbar-link-logout">
                        Log Out
                    </Button>
                </>
            ) : (
                <>
                    <Link to='/' className="navbar-link-home">
                        Home
                    </Link>
                    <Link to='/login' className="navbar-link-login">
                        Login
                    </Link>
                    <Link to='/register' className="navbar-link-register">
                        Register
                    </Link>
                </>
            )}
        </nav>

    )
}

export default Navbar;