// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Logoipsum</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/questions">Questions</Link>
        </li>
        <li>
          <Link to="/upgrade">Upgrade</Link>
        </li>
        <li>
          <Link to="/how-it-works">How it Works?</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
