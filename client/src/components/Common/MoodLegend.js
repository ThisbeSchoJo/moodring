import React from "react";
import { MOOD_COLORS } from "../../utils/moodColors";
import "../../styling/moodlegend.css";

const MoodLegend = ({ isVisible, onToggle }) => {
  if (!isVisible) return null;

  const allMoods = [
    "happy",
    "excited",
    "grateful",
    "hopeful",
    "in love",
    "calm",
    "neutral",
    "sad",
    "angry",
    "anxious",
    "confused",
  ];

  return (
    <div className="mood-legend">
      <div className="legend-header">
        <h3>Mood Color Guide</h3>
        <button className="close-legend" onClick={onToggle}>
          ×
        </button>
      </div>

      <div className="legend-content">
        <div className="mood-items">
          {allMoods.map((mood) => (
            <div key={mood} className="mood-item">
              <div
                className="mood-color"
                style={{
                  background: MOOD_COLORS[mood].gradient,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                  border: "2px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
              <span className="mood-name">
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="legend-note">
          <p>
            <strong>💡 Tip:</strong> Multiple emotions in an entry will blend
            colors together, creating a unique gradient that represents the
            emotional complexity of your entry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodLegend;
