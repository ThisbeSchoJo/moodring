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
  const [hoveredEntry, setHoveredEntry] = useState(null);
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

  // Function to create hover gradient based on entry's mood colors
  const createHoverGradient = (entry) => {
    const moodColors = getMoodColors(entry.mood);
    const moods = parseMoods(entry.mood);

    if (moods.length === 1) {
      // Single mood - intensify the colors
      return `linear-gradient(135deg, ${moodColors.primary} 0%, ${moodColors.secondary} 50%, ${moodColors.primary} 100%)`;
    } else {
      // Multiple moods - create a more vibrant blend
      const colors = moods.map((mood) => getMoodColors(mood));
      const primaryColors = colors.map((c) => c.primary);
      const secondaryColors = colors.map((c) => c.secondary);

      return `linear-gradient(135deg, ${primaryColors[0]} 0%, ${
        secondaryColors[0]
      } 25%, ${primaryColors[1] || primaryColors[0]} 50%, ${
        secondaryColors[1] || secondaryColors[0]
      } 75%, ${primaryColors[0]} 100%)`;
    }
  };

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
                background:
                  hoveredEntry === entry.id
                    ? createHoverGradient(entry)
                    : entryGradient,
                color: textColor,
                textShadow: "none",
                transition: "all 0.4s ease",
                cursor: "pointer",
                transform:
                  hoveredEntry === entry.id ? "scale(1.02)" : "scale(1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={() => setHoveredEntry(entry.id)}
              onMouseLeave={() => setHoveredEntry(null)}
            >
              {/* Shimmer effect overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: hoveredEntry === entry.id ? "100%" : "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  transition: "left 0.5s ease",
                  pointerEvents: "none",
                }}
              />
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
