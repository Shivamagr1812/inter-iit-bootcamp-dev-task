import React, { useState } from 'react';
import styles from './loginPane.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import CircularProgress from '@mui/material/CircularProgress';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [logIn, setLogIn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    const loginUser = async () => {
        setLoading('true');
        try {
            const res = await axios.post(backendUrl + '/auth', { email, password });
            console.log(res);
            localStorage.setItem('token', res.data.token); // Store JWT token in localStorage
            navigate('/chat'); // Redirect to protected route
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMsg(error.response.data.message);
            setTimeout(() => setErrorMsg(''), 3000);
        }
        setLoading('false');
    };

    const registerUser = async () => {
        if (password !== confirmPassword) {
            setErrorMsg('Password and Confirm Password do not match!!');
            setTimeout(() => setErrorMsg(''), 3000);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(backendUrl + '/register', { email, password });
            console.log(res);
            localStorage.setItem('token', res.data.token);
            navigate('/chat');
        } catch (error) {
            console.error('SignUp failed:', error);
            setErrorMsg(error.response.data.message);
            setTimeout(() => setErrorMsg(''), 3000);
        }
        setLoading(false);
    }

    const toggleLogIn = async () => {
        setLogIn(!logIn);
    }

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.desc}>
                    <div className={styles.info}>
                        <p className={styles.heading}>AutoPilot</p>
                        <TypeAnimation
                            sequence={[
                                'Transforming Data into Dialogue',
                                1000,
                                'Where Questions Meet Infinite Answers',
                                1000,
                                'From Text to Insights, in Seconds',
                                1000,
                                'Redefining Human-AI Interactions',
                                1000,
                            ]}
                            speed={50}
                            repeat={Infinity}
                            className={styles.tag}
                        />
                    </div>
                </div>
                <div className={styles.login}>
                    <div className={styles.card}>
                        <span>{logIn ? 'Log into your account' : 'Create a new account'}</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className={styles.logInInput}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className={styles.logInInput}
                        />
                        {!logIn &&
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className={styles.logInInput}
                            />
                        }
                        {logIn ? <button onClick={loginUser} className={styles.logInButton}>
                            {loading ? <CircularProgress sx={{ color: 'white' }} /> : 'Login'}
                        </button> : <button onClick={registerUser} className={styles.logInButton}>{loading ? <CircularProgress sx={{ color: 'white' }} /> : 'Sign Up'}</button>}
                        <span onClick={toggleLogIn} className={styles.toggle}>{logIn ? 'New User?' : 'Already have an account?'}</span>
                    </div>
                    {errorMsg && <div className={styles.errorMsg}>
                        <p>{errorMsg}</p>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default Login;
