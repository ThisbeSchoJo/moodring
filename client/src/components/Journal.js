import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getMoodColors, getMoodEmoji, parseMoods } from "../utils/moodColors";
import MoodLegend from "./MoodLegend";
import { Palette } from "lucide-react";
import "../styling/journal.css";

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [showLegend, setShowLegend] = useState(false);
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
      <div className="journal-header">
        <h1>Journal</h1>
        <div className="journal-actions">
          <button
            className="legend-button"
            onClick={() => setShowLegend(true)}
            title="View Mood Color Guide"
          >
            <Palette size={20} />
            Color Guide
          </button>
          <Link to="/new" className="new-entry-button">
            New Entry
          </Link>
        </div>
      </div>
      <p>{entries.length} entries loaded</p>
      {entries.map((entry) => {
        const moodColors = getMoodColors(entry.mood);
        const moods = parseMoods(entry.mood);

        return (
          <div key={entry.id} className="entry-container">
            <div
              className="entry-header"
              style={{
                background: moodColors.gradient,
                borderRadius: "8px 8px 0 0",
                padding: "12px 16px",
                color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              <Link
                to={`/entry/${entry.id}`}
                className="entry-title"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {entry.title}
              </Link>
              <div className="entry-mood-info">
                <span className="entry-mood-emoji">
                  {getMoodEmoji(entry.mood)}
                </span>
                <span className="entry-mood-text">
                  {moods.length > 1 ? moods.join(", ") : moods[0]}
                </span>
              </div>
            </div>
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
        );
      })}

      <MoodLegend
        isVisible={showLegend}
        onToggle={() => setShowLegend(false)}
      />
    </div>
  );
};

export default Journal;
