import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>MoodRing</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            <span>Journal</span>
          </Link>
          <Link to="/new" className="nav-link">
            <span>New Entry</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;

