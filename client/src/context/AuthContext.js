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
    try {
      // Retrieve user data from localStorage if available
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Validate stored user data
        if (parsedUser && parsedUser.id && parsedUser.username) {
          setUser(parsedUser);
        } else {
          // Invalid data in localStorage, clear it
          localStorage.removeItem("user");
          // Invalid user data found in localStorage, cleared
        }
      }
    } catch (error) {
      // Clear corrupted localStorage data silently
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function - authenticates user with backend API
  const login = async (username, password) => {
    try {
      // Validate input
      if (!username?.trim() || !password?.trim()) {
        return {
          success: false,
          error: "Username and password are required",
        };
      }

      // Send login request to backend
      const response = await axios.post("http://localhost:5555/login", {
        username: username.trim(),
        password,
      });

      const userData = response.data;

      // Validate response data
      if (!userData || !userData.id || !userData.username) {
        return {
          success: false,
          error: "Invalid response from server",
        };
      }

      // Update user state and persist to localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      let errorMessage = "Login failed";

      if (error.response?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.error || "Invalid login data";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found";
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Logout function - clears user session
  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      // Even if localStorage fails, clear the user state
      setUser(null);
    }
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
