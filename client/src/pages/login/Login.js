import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, login] = useLogin();

    const handleSubmit = async(e) => {
        e.preventDefault();
        await login(username,password);
    }


    
  return (
    <div class="login-container">
  <h1>Login</h1>
  <form id="loginForm" onSubmit={handleSubmit}>
    <div class="input-group">
      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
    <div class="input-group">
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" required value={password} onChange={(e) => {setPassword(e.target.value)}} />
    </div>
    <button type="submit" disabled={loading}>
        Login
    </button>
    <Link to='/signup'><h3>Don't have an account SignUp</h3></Link>
  </form>
</div>
  )
}

export default Login
