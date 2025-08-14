import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Journal = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:5555/entries");
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div>
      <h1>Journal</h1>
    </div>
  );
};

export default Journal;
