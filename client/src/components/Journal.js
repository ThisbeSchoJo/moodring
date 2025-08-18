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
          <div
            key={entry.id}
            className="entry-container"
            style={{
              background: moodColors.gradient,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              border: "none",
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            <div className="entry-header" style={{ padding: "16px 20px" }}>
              <Link
                to={`/entry/${entry.id}`}
                className="entry-title"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "1.3rem",
                  fontWeight: "600",
                }}
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
            <div
              className="entry-content"
              style={{
                padding: "0 20px 16px 20px",
                color: "#fff",
                lineHeight: "1.7",
                fontSize: "1rem",
              }}
            >
              {entry.content}
            </div>
            <div
              className="entry-date"
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.1)",
                borderTop: "1px solid rgba(255,255,255,0.2)",
                fontSize: "0.9rem",
                opacity: "0.9",
              }}
            >
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
