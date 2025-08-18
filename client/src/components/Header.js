import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styling/header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
