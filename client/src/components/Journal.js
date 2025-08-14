import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styling/journal.css";

const Journal = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:5555/entries");
        setEntries(response.data);
        console.log("Fetched entries:", response.data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

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
          <div className="entry-date">{entry.created_at}</div>
        </div>
      ))}
    </div>
  );
};

export default Journal;
