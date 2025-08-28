// Main App component - sets up routing, authentication, and overall application structure
// Uses React Router for navigation and AuthProvider for user state management
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Common/Header";
import Journal from "./components/Journal/Journal";
import EntryForm from "./components/Common/EntryForm";
import EntryDetail from "./components/EntryDetail/EntryDetail";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Profile from "./components/Profile/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import "./App.css";

// Main routing component with authentication protection
function AppRoutes() {
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication status
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {/* Header component appears on all authenticated pages */}
      <Header />

      {/* Route definitions with authentication guards */}
      <Routes>
        {/* Login page - redirects to home if already logged in */}
        <Route
          path="/login"
          element={
            <main className="container">
              {user ? <Navigate to="/" replace /> : <Login />}
            </main>
          }
        />

        {/* Signup page - redirects to home if already logged in */}
        <Route
          path="/signup"
          element={
            <main className="container">
              {user ? <Navigate to="/" replace /> : <Signup />}
            </main>
          }
        />

        {/* Home/Journal page - main dashboard showing all entries */}
        <Route
          path="/"
          element={
            <main className="container full-width">
              {user ? <Journal /> : <Navigate to="/login" replace />}
            </main>
          }
        />

        {/* New entry form - for creating new journal entries */}
        <Route
          path="/new"
          element={
            <main className="container">
              {user ? <EntryForm /> : <Navigate to="/login" replace />}
            </main>
          }
        />

        {/* Entry detail page - for viewing and editing individual entries */}
        <Route
          path="/entry/:id"
          element={
            <main className="container full-width">
              {user ? <EntryDetail /> : <Navigate to="/login" replace />}
            </main>
          }
        />

        {/* Profile page - AI-generated personality insights */}
        <Route
          path="/profile"
          element={
            <main className="container">
              {user ? <Profile /> : <Navigate to="/login" replace />}
            </main>
          }
        />
      </Routes>
    </div>
  );
}

// Root App component that wraps everything with providers
function App() {
  return (
    // AuthProvider manages user authentication state across the app
    <AuthProvider>
      {/* Router enables client-side navigation */}
      <Router>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
