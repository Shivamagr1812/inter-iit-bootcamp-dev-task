import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './Components/Chat';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Navbar from './Components/Navbar';

function App() {
  const [username, setUsername] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  return (
    <Router>
      <Navbar username={username} handleLogout={handleLogout} />
      <div>
        <Routes>
          <Route path="/login" element={<Login setUsername={setUsername} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={username ? <Chat username={username} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
