import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MoodLegend from "./MoodLegend";
import { Palette } from "lucide-react";
import "../styling/header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLegend, setShowLegend] = useState(false);

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
              <button
                className="legend-button"
                onClick={() => setShowLegend(true)}
                title="View Mood Color Guide"
              >
                <Palette size={20} />
                Color Guide
              </button>
              <div className="user-section">
                <span className="username">Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                  title="Logout"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
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
      {showLegend && <MoodLegend onClose={() => setShowLegend(false)} />}
    </header>
  );
};

export default Header;
