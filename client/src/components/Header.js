import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styling/header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>MoodRing</h1>
        </Link>
        <nav className="nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">
                <span>Journal</span>
              </Link>
              <Link to="/new" className="nav-link">
                <span>New Entry</span>
              </Link>
              <div className="user-section">
                <span className="username">Welcome, {user.username}!</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
