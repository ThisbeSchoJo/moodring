import React from "react";
import { Link } from "react-router-dom";
import {
  getMoodColors,
  parseMoods,
  getTextColor,
  createEntryGradient,
} from "../utils/moodColors";

const JournalEntryItem = ({
  entry,
  index,
  totalEntries,
  allEntries,
  hoveredEntry,
  setHoveredEntry,
  createHoverGradient,
}) => {
  // Get mood colors and parse emotions for this entry
  const moodColors = getMoodColors(entry.mood);
  const moods = parseMoods(entry.mood);
  const textColor = getTextColor(entry.mood);

  // Create seamless gradient that blends with adjacent entries
  const entryGradient = createEntryGradient(
    entry.mood,
    index,
    totalEntries,
    allEntries
  );

  return (
    <Link
      to={`/entry/${entry.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background:
            hoveredEntry === entry.id
              ? createHoverGradient(entry)
              : entryGradient,
          color: textColor,
          textShadow: "none",
          transition: "all 0.4s ease",
          cursor: "pointer",
          transform: hoveredEntry === entry.id ? "scale(1.02)" : "scale(1)",
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
              index === 0
                ? "38.832px 58.248px 38.832px 58.248px" /* 24 * 1.618 ≈ 38.832, 36 * 1.618 ≈ 58.248 */
                : "38.832px 58.248px 38.832px 58.248px",
            margin:
              "0 58.248px 19.416px 58.248px" /* 36 * 1.618 ≈ 58.248, 12 * 1.618 ≈ 19.416 */,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20.225px" /* 12.5 * 1.618 ≈ 20.225 */,
              marginBottom: "20.225px" /* 12.5 * 1.618 ≈ 20.225 */,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10.113px" /* 6.25 * 1.618 ≈ 10.113 */,
                flex: "1",
                minWidth: "0",
              }}
            >
              <div
                style={{
                  color: "#1a252f",
                  textDecoration: "none",
                  fontSize: "2.023rem" /* 1.25 * 1.618 ≈ 2.023 */,
                  fontWeight: "800",
                  textTransform: "uppercase",
                }}
              >
                {entry.title}
              </div>
              <div
                style={{
                  fontSize: "1.309rem" /* 0.809 * 1.618 ≈ 1.309 */,
                  color: "#1a252f",
                  fontWeight: "700",
                  opacity: "0.9",
                }}
              >
                {new Date(entry.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8.09px" /* 5 * 1.618 ≈ 8.09 */,
                justifyContent: "flex-end",
                alignItems: "flex-start",
                flexShrink: "0",
                maxWidth: "485.4px" /* 300 * 1.618 ≈ 485.4 */,
              }}
            >
              {moods.map((mood, moodIndex) => (
                <div
                  key={moodIndex}
                  style={{
                    background: getMoodColors(mood).gradient,
                    color: "#ffffff",
                    padding:
                      "10.113px 15.17px" /* 6.25 * 1.618 ≈ 10.113, 9.375 * 1.618 ≈ 15.17 */,
                    borderRadius: "15.17px" /* 9.375 * 1.618 ≈ 15.17 */,
                    fontSize: "1.571rem" /* 0.971 * 1.618 ≈ 1.571 */,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2.5px 10px rgba(0,0,0,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    textShadow: "0 1.25px 2.5px rgba(0,0,0,0.3)",
                  }}
                >
                  {mood}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              color: "#1a252f",
              lineHeight: "1.6",
              fontSize: "1.702rem" /* 1.052 * 1.618 ≈ 1.702 */,
              fontWeight: "600",
            }}
          >
            {entry.content}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JournalEntryItem;
