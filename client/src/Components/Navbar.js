
import React from 'react';
import './Navbar.css' ;
import { Link } from 'react-router-dom';

const Navbar = ({ username, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Chat App</h1>
      </div>
      <div className="navbar-links">
        {!username ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <span>Welcome, {username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
