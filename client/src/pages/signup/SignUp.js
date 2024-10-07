import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSignup from '../../hooks/useSignUp';

const SignUp = () => {
    const [input, setInput] = useState({
        fullName:"",
        username:"",
        password:"",
        confirmPassword:"",
    });

    const [loading, signup] = useSignup();

    const handleSubmit = async(e) => {
        e.preventDefault();
        await signup(input);

    }
    return (
        <div class="login-container">
      <h1>Sign Up</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
      <div class="input-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="username" name="fullName" required value={input.fullName} onChange={(e) => setInput({...input, fullName:e.target.value})} />
        </div>
        <div class="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required value={input.username} onChange={(e) => setInput({...input, username:e.target.value})} />
        </div>
        <div class="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required value={input.password} onChange={(e) => setInput({...input, password:e.target.value})} />
        </div>
        <div class="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="password" name="confirmPassword" required value={input.confirmPassword} onChange={(e) => setInput({...input, confirmPassword:e.target.value})} />
        </div>
        <button type="submit" disabled={loading}>
        Sign Up
        </button>
        <Link to='/login'><h3>Already have an account? Login</h3></Link>
      </form>
    </div>
      )
}

export default SignUp
