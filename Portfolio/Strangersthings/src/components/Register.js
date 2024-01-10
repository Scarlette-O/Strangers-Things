import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';

const Register = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const navigate = useNavigate()


    const handleSubmit = async (event) => {
        event.preventDefault()
        if (password !== passwordConfirmation) {
            return alert('passwords do not match')
        }

        try {
            const response = await fetch('https://strangers-things.herokuapp.com/api/2303-FTB-ET-WEB-PT/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    user: {
                        username,
                        password
                    }
                })
            })
            const data = await response.json()
            setUsername('')
            setPassword('')
            setToken(data.data.token)
            console.log(data)
            if (setToken) {
                navigate('/login')
            }
            return data
        } catch (error) {
            console.error(error.message)
        }
    }



    return (
        <div className='register'>
            <h1 className='register-title'>Register</h1>
            <form className="Register-form" onSubmit={handleSubmit}>
                <label className='register-username'>
                    Username:
                    <input type='text' minLength={8} maxLength={15} value={username} required onChange={(event) => setUsername(event.target.value)} className='register-username-input' />
                </label>
                <br />
                <label className='register-email'> Email:
                    <input type='email' value={email} required onChange={(event) => setEmail(event.target.value)} className='register-email-input' />
                </label>
                <br />
                <label className='register-password'>
                    Password:
                    <input type='password' minLength={8} maxLength={15} value={password} required onChange={(event) => setPassword(event.target.value)} className='register-password-input' />
                </label>
                <br />
                <label className='register-confirm-password'>
                    Confirm Password:
                    <input type='password' value={passwordConfirmation} required onChange={(event) => setPasswordConfirmation(event.target.value)} className='register-confirm-password-input' />
                </label>
                <br />
                <button type='submit' className='register-account-button'>Register</button>
            </form>
            <Link to='/login' className='redirect-login'><button>Already have an account? Log in!</button></Link>
        </div>
    )

}

export default Register;