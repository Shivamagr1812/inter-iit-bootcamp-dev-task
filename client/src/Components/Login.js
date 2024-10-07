import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Navigate, useNavigate } from "react-router-dom";
import '../css/Login.css';

const Login = () => {
    const userRef = useRef(null);
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const history = useNavigate();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await login(username, password);
            setSuccess(true);
            history.push("/");

        } catch (err) {
            if (err.message === 'No Server Response') {
                setErrMsg('No Server Response');
            } else if (err?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };
    
    return (
        <div className='container'>
            {success ? (
                <Navigate to="/chat" />
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username" style={{ fontSize: 'large' }}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                        />
                        <br />
                        <label htmlFor="password" style={{ fontSize: 'large' }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            required
                        />
                        <button type='submit'>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            <br />
                            <a href="/register">Sign Up</a>
                        </span>
                    </p>
                </section>
            )}
        </div>
    );
};

export default Login;
