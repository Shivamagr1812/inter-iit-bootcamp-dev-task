import React, { useState } from 'react';
import './auth.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Login() {
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
   
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL 
   
    e.preventDefault();
    await axios.post(`${backendUrl}/user/login`,{email,password},{headers:{
        "Content-Type":"application/json"                       //! The server uses this header to understand how to parse the request body. In this case, it knows that it should expect JSON and parse it accordingly.
              }})
              .then(data=>{console.log(data.data);setEmail('');setPassword('');
        if(data.data.success){
        
        
        localStorage.setItem('authToken',data.data.authToken);
        console.log(localStorage.getItem('authToken'));
        localStorage.setItem('userEmail', email); // Store user email
        navigate('/main');
        }
        
        
              })
              .catch(err=>{console.log(err); alert('Please enter valid credentials')})
    
    // Handle onLogin
  };
  const handleMove =()=>{
    navigate('/')
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        <button onClick={handleMove} >Sign up</button>
       Create new account 
      </p>
    </div>
  );
}

export default Login;