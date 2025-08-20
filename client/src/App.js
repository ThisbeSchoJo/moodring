import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Journal from "./components/Journal";
import EntryForm from "./components/EntryForm";
import EntryDetail from "./components/EntryDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            <main className="container">
              {user ? <Navigate to="/" replace /> : <Login />}
            </main>
          }
        />
        <Route
          path="/signup"
          element={
            <main className="container">
              {user ? <Navigate to="/" replace /> : <Signup />}
            </main>
          }
        />
        <Route
          path="/"
          element={
            <main className="container full-width">
              {user ? <Journal /> : <Navigate to="/login" replace />}
            </main>
          }
        />
        <Route
          path="/new"
          element={
            <main className="container">
              {user ? <EntryForm /> : <Navigate to="/login" replace />}
            </main>
          }
        />
        <Route
          path="/entry/:id"
          element={
            <main className="container full-width">
              {user ? <EntryDetail /> : <Navigate to="/login" replace />}
            </main>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
