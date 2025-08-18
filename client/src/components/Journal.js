import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styling/journal.css";

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/entries?user_id=${user.id}`
        );
        setEntries(response.data);
        console.log("Fetched entries:", response.data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    if (user) {
      fetchEntries();
    }
  }, [user]);

  return (
    <div>
      <h1>Journal</h1>
      <Link to="/new" className="new-entry-button">
        New Entry
      </Link>
      <p>{entries.length} entries loaded</p>
      {entries.map((entry) => (
        <div key={entry.id} className="entry-container">
          <Link to={`/entry/${entry.id}`} className="entry-title">
            {entry.title}
          </Link>
          <div className="entry-content">{entry.content}</div>
          <div className="entry-date">
            {new Date(entry.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Journal;
