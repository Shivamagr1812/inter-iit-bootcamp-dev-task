import React, { useState } from 'react';
import './auth.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Signup() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name,setName] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL 
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle  onSignup
    axios.post(`${backendUrl}/user/signup`,{name,email,password},{headers:{
        "Content-Type":"application/json"                       //! The server uses this header to understand how to parse the request body. In this case, it knows that it should expect JSON and parse it accordingly.
               }})
               .then(data=>{console.log(data.data.user);setName('');setEmail('');setPassword('')
       ;
       navigate('/login')
       
       
       
               })
               .catch(err=>{console.log(err); alert('Please enter valid credentials')})
  };
  const handleMove =()=>{
    navigate('/login')
  }

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your Email-id here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
       <button onClick={handleMove} >Login</button>
       Already have an account?
      </p>
    </div>
  );
}

export default Signup;