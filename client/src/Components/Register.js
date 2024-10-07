import React, { useRef, useState, useEffect } from "react";
import {faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../Context/AuthContext";
import { Navigate, useNavigate } from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const { register , user } = useAuth();
    const history = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [username, password, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
    
        try {
            const response = await register(username, password); // This will now return the correct response
    
            if (response && response.status === 201) {
                setSuccess(true);
                history("/login");
                setUsername('');
                setPassword('');
                setMatchPwd('');
            }
        } catch (err) {
            // Handle specific errors
            if (err.message === 'Username already exists') {
                setErrMsg('Username already taken. Please choose another.');
            } else {
                setErrMsg(err.message || 'Registration Failed');
            }
            errRef.current.focus(); // Ensure the error message is focused for accessibility
        }
    };
    
    if (user) {
        return <Navigate to="/chat" replace />;
    }

    return (
        <div className='container'>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            placeholder="Username"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                         
                        <br />

                        <label htmlFor="password">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            placeholder="Password"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        
                        <br />

                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            placeholder="Password"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        
                        <br />

                        <button type="submit" disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                         <br />
                        Already registered?<br />
                        <span className="line">
                            <br />
                            <a href="/login" style={{ fontSize: 'medium' }}>Sign In</a>
                        </span>
                    </p>
                    <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"} style={{fontSize:'small', position: "absolute", marginTop:'550px'}}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                    </p>
                    
                    <p id="pwdnote" className={pwdFocus && password && !validPwd ? "instructions" : "offscreen"}style={{fontSize:'small', position: "absolute", marginTop:'550px'}}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                    <p id="confirmnote" className={matchFocus && matchPwd && !validMatch ? "instructions" : "offscreen"} style={{fontSize:'small', position: "absolute", marginTop:'550px'}}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                    </p>
                </section>
            )}
        </div>
    )
}

export default Register;