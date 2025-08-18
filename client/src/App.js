import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Journal from "./components/Journal";
import EntryForm from "./components/EntryForm";
import EntryDetail from "./components/EntryDetail";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Journal />} />
            <Route path="/new" element={<EntryForm />} />
            <Route path="/entry/:id" element={<EntryDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
