import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>MoodRing</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            <Home size={20} />
            <span>Journal</span>
          </Link>
          <Link to="/new" className="nav-link">
            <Plus size={20} />
            <span>New Entry</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

