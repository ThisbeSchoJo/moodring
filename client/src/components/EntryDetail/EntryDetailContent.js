// EntryDetailContent component - displays entry title, date, and mood tags
// Features: Editable title, formatted date display, mood tag rendering, golden ratio styling
import React from "react";
import { getMoodColors, parseMoods } from "../../utils/moodColors";

const EntryDetailContent = ({
  entry,
  isEditing,
  onTitleChange,
  textColor,
  textShadow,
}) => {
  return (
    <div
      className="entry-meta"
      style={{
        padding: "39px 39px 26px 39px",
        position: "relative",
      }}
    >
      {/* 24 * 1.618 ≈ 39, 16 * 1.618 ≈ 26 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px" /* 6.25 * 1.618 ≈ 10 */,
          flex: "1",
          minWidth: "0",
          paddingRight: "320px",
        }}
      >
        {!isEditing ? (
          <h1
            style={{
              margin: "0",
              fontSize: "2rem" /* 1.25 * 1.618 ≈ 2 */,
              fontWeight: "800",
              color: "#1a252f",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            {entry.title}
          </h1>
        ) : (
          <input
            type="text"
            value={entry.title}
            onChange={onTitleChange}
            placeholder="Entry title..."
            className="title-input"
            aria-label="Edit entry title"
            style={{
              fontSize: "2rem" /* 1.25 * 1.618 ≈ 2 */,
              fontWeight: "800",
              border: "none",
              borderRadius: "0",
              padding: "26px 0" /* 16 * 1.618 ≈ 26 */,
              color: "#1a252f",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              width: "100%",
              minWidth: "0",
              boxSizing: "border-box",
              background: "transparent",
            }}
          />
        )}
        <div
          className="entry-date"
          style={{
            fontSize: "1.3rem" /* 0.809 * 1.618 ≈ 1.3 */,
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
        className="entry-mood-display"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px" /* 5 * 1.618 ≈ 8 */,
          justifyContent: "flex-end",
          alignItems: "flex-start",
          position: "absolute",
          top: "39px",
          right: "39px",
          width: "300px",
          maxWidth: "300px",
        }}
      >
        {parseMoods(entry.mood).map((mood, moodIndex) => (
          <div
            key={moodIndex}
            style={{
              background: getMoodColors(mood).gradient,
              color: "#ffffff",
              padding: "10px 15px" /* 6.25 * 1.618 ≈ 10, 9.375 * 1.618 ≈ 15 */,
              borderRadius: "15px" /* 9.375 * 1.618 ≈ 15 */,
              fontSize: "1.6rem" /* 0.971 * 1.618 ≈ 1.6 */,
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
  );
};

export default EntryDetailContent;
