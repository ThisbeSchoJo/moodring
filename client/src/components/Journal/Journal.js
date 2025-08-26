// Journal component - displays all journal entries for the current user
// Features: AI-generated mood colors, seamless gradient blending, hover effects
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import JournalEntryItem from "./JournalEntryItem";
import { getMoodColors, parseMoods } from "../../utils/moodColors";
import "../../styling/journal.css";

const Journal = () => {
  // State for storing journal entries and tracking hover state
  const [entries, setEntries] = useState([]);
  const [hoveredEntry, setHoveredEntry] = useState(null);
  const { user } = useAuth();

  // Fetch user's journal entries on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/entries?user_id=${user.id}`
        );
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    if (user) {
      fetchEntries();
    }
  }, [user]);

  // Create enhanced gradient for hover effects based on entry's mood colors
  const createHoverGradient = (entry) => {
    const moodColors = getMoodColors(entry.mood);
    const moods = parseMoods(entry.mood);

    if (moods.length === 1) {
      // Single mood - intensify the colors for more dramatic hover effect
      return `linear-gradient(135deg, ${moodColors.primary} 0%, ${moodColors.secondary} 50%, ${moodColors.primary} 100%)`;
    } else {
      // Multiple moods - create a more vibrant blend using all detected emotions
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
      <div>
        {entries.map((entry, index) => (
          <JournalEntryItem
            key={entry.id}
            entry={entry}
            index={index}
            totalEntries={entries.length}
            allEntries={entries}
            hoveredEntry={hoveredEntry}
            setHoveredEntry={setHoveredEntry}
            createHoverGradient={createHoverGradient}
          />
        ))}
      </div>
    </div>
  );
};

export default Journal;
