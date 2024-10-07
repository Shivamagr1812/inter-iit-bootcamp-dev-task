import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    const handleButton1 = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/signup', { email, password });
          console.log(response);
          if(response.data.email){
            setMessage('User Signuped successfully!');
            setEmail('');
            setPassword('');
            
            alert("User Signuped successfully!");
            navigate("/",{replace:true});
            window.location.reload();
          } 
          else if (response.data.msg === 'user already exists') {
            // Navigate to login page when user exists
            setMessage('User already exists. Redirecting to login...');
            alert("User already exists. Redirecting to login...");
            setTimeout(() => navigate('/'), 2000);
          } 
          else{
            alert(response.data.msg);
          }
          
        } catch (error) {
          if (error.response) {
            // Server responded with a status other than 200
            console.error('Server responded with an error:', error.response.data.message);
          } else if (error.request) {
            // No response from the server
            console.error('No response from the server:', error.request);
          } else {
            // Other errors
            console.error('Error in setting up request:', error.message);
          }
          setMessage('Error: ' + error.response.data.message);
          console.log(error);
        }
    };

    const handleButton2 = async (event) => {
        event.preventDefault();
        try {
            navigate("/",{replace:true});
            window.location.reload();
        } catch (error) {
            
        }
    }

  return (
    <StyledWrapper>
      <div className="card">
        <div className="card2">
          <form className="form">
            <p id="heading">Sign Up</p>
            <div className="field">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                className="input-icon"
              >
                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
              </svg>
              <input
                type="text"
                className="input-field"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="field">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                className="input-icon"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
              <input
                type="password"
                className="input-field"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="btn">
              <button className="button1" onClick={handleButton1}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sign Up&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
              <button className="button2" onClick={handleButton2}>Login</button>
            </div>
            {/* <button className="button3">Forgot Password</button> */}
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa; /* Light background color */

  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 3em;
    background-color: #ffffff; /* White background for the form */
    border-radius: 25px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    transition: 0.4s ease-in-out;
  }

  .card {
    background-color: #007bff; /* A light blue background for the card */
    border-radius: 22px;
    transition: all 0.3s;
  }

  .card2 {
    border-radius: 0;
    transition: all 0.2s;
    padding: 0.25em;
  }

  .card2:hover {
    transform: scale(0.98);
    border-radius: 20px;
  }

  .card:hover {
    box-shadow: 0px 0px 30px 1px rgba(0, 123, 255, 0.3); /* Hover effect for the card */
  }

  #heading {
    text-align: center;
    margin: 1em 0;
    color: #333; /* Dark text color */
    font-size: 1.5em; /* Slightly larger heading */
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em;
    border: 1px solid #ced4da; /* Light border color */
    outline: none;
    background-color: #ffffff; /* White background for input fields */
    color: #333; /* Dark text color */
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle inset shadow */
  }

  .input-icon {
    height: 1.3em;
    width: 1.3em;
    fill: #007bff; /* Icon color */
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: #333; /* Dark text color */
  }

  .form .btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 2em;
  }

  .button1 {
    padding: 0.5em 1.1em;
    border-radius: 5px;
    margin-right: 0.5em;
    border: none;
    outline: none;
    transition: 0.4s ease-in-out;
    background-color: #007bff; /* Primary button color */
    color: white; /* Text color */
  }

  .button1:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }

  .button2 {
    padding: 0.5em 2.3em;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: 0.4s ease-in-out;
    background-color: #6c757d; /* Secondary button color */
    color: white; /* Text color */
  }

  .button2:hover {
    background-color: #5a6268; /* Darker gray on hover */
  }
`;

export default Signup;