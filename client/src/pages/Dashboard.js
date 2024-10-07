// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddNewChat from '../components/AddNewChat';
import PreviousChats from '../components/PreviousChats';
import { getCurrentUser } from '../services/authService'; 

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getCurrentUser(); // Assuming this fetches user data based on the token
      if (userData) {
        setUser(userData); // Set the current user
        fetchChats(); // Fetch chats without passing userId in the URL
      } else {
        navigate('/register'); // Redirect to login if no user data
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current Token:', token);

      // Fetch chats with token in the Authorization header
      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is unauthorized or valid
      if (response.status === 401) {
        console.error('Unauthorized: Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();
      console.log('Chats fetched:', data);
      setChats(data); // Set chats from response
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // Clear user state on logout
    navigate('/');
  };

  // Function to handle navigation to the file upload page
  const navigateToFileUpload = () => {
    navigate('/fileUpload');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <p>Try out the new GPT-5</p>
        {user && (
          <div>
            <p>Welcome, {user.name}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>
      <div className="auth-buttons">
        {!user && ( // Show login/register buttons if not authenticated
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        )}
      </div>
      <AddNewChat />
      <button onClick={navigateToFileUpload}>Upload PDF</button> {/* Add file upload button */}
      <PreviousChats chats={chats} />
    </div>
  );
};

export default Dashboard;
