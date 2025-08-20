// Authentication Context - manages user authentication state across the application
// Provides login, logout, and user state management with localStorage persistence
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create React context for authentication
const AuthContext = createContext();

// Custom hook to access authentication context
// Throws error if used outside of AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Authentication provider component that wraps the app
export const AuthProvider = ({ children }) => {
  // State for current user and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on app startup
  useEffect(() => {
    // Retrieve user data from localStorage if available
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login function - authenticates user with backend API
  const login = async (username, password) => {
    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:5555/login", {
        username,
        password,
      });

      const userData = response.data;

      // Update user state and persist to localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      // Return error message from backend or generic error
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  // Logout function - clears user session
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Context value object containing all auth-related functions and state
  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
