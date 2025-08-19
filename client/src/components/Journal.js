import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  getMoodColors,
  getMoodEmoji,
  parseMoods,
  getTextColor,
  getTextShadow,
  createEntryGradient,
} from "../utils/moodColors";
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
    <div
      style={{
        width: "100%",
        maxWidth: "none",
        margin: 0,
        padding: 0,
      }}
    >
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
      <div>
        {entries.map((entry, index) => {
          const moodColors = getMoodColors(entry.mood);
          const moods = parseMoods(entry.mood);
          const textColor = getTextColor(entry.mood);
          const entryGradient = createEntryGradient(
            entry.mood,
            index,
            entries.length,
            entries
          );

          return (
            <div
              key={entry.id}
              style={{
                background: entryGradient,
                color: textColor,
                textShadow: "none",
              }}
            >
              <div
                style={{
                  padding:
                    index === 0 ? "0 48px 16px 48px" : "32px 48px 16px 48px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <Link
                    to={`/entry/${entry.id}`}
                    style={{
                      color: textColor,
                      textDecoration: "none",
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      textShadow: "none",
                      flex: "1",
                    }}
                  >
                    {entry.title}
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        background: "transparent",
                        border: "none",
                        color: textColor,
                        textShadow: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.9rem",
                      }}
                    >
                      <span>{getMoodEmoji(entry.mood)}</span>
                      <span
                        style={{
                          fontWeight: "500",
                          textTransform: "capitalize",
                        }}
                      >
                        {moods.length > 1 ? moods.join(", ") : moods[0]}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        opacity: "0.7",
                        color: textColor,
                        textShadow: "none",
                        fontStyle: "italic",
                      }}
                    >
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "0 48px 32px 48px",
                  color: textColor,
                  lineHeight: "1.7",
                  fontSize: "1rem",
                  textShadow: "none",
                }}
              >
                {entry.content}
              </div>
            </div>
          );
        })}
      </div>

      <MoodLegend
        isVisible={showLegend}
        onToggle={() => setShowLegend(false)}
      />
    </div>
  );
};

export default Journal;
