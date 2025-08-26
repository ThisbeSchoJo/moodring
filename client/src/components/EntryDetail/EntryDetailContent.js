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
        padding: "38.832px 38.832px 25.888px 38.832px",
        position: "relative",
      }}
    >
      {/* 24 * 1.618 ≈ 38.832, 16 * 1.618 ≈ 25.888 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10.113px" /* 6.25 * 1.618 ≈ 10.113 */,
          flex: "1",
          minWidth: "0",
          paddingRight: "320px",
        }}
      >
        {!isEditing ? (
          <h1
            style={{
              margin: "0",
              fontSize: "2.023rem" /* 1.25 * 1.618 ≈ 2.023 */,
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
              fontSize: "2.023rem" /* 1.25 * 1.618 ≈ 2.023 */,
              fontWeight: "800",
              border: "none",
              borderRadius: "0",
              padding: "25.888px 0" /* 16 * 1.618 ≈ 25.888 */,
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
        className="entry-mood-display"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8.09px" /* 5 * 1.618 ≈ 8.09 */,
          justifyContent: "flex-end",
          alignItems: "flex-start",
          position: "absolute",
          top: "38.832px",
          right: "38.832px",
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
  );
};

export default EntryDetailContent;
