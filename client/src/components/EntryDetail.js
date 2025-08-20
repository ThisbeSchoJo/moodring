import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// axios is used to make HTTP requests to the server (automatic JSON parsing, better error handling, request/response interceptors, request cancellation, progress monitoring)
import axios from "axios";
import {
  getMoodColors,
  getMoodEmoji,
  parseMoods,
  getTextColor,
  getTextShadow,
} from "../utils/moodColors";
import "../styling/entrydetail.css";

const EntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedMood, setEditedMood] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await axios.get(`http://localhost:5555/entries/${id}`);
      setEntry(response.data);
      setEditedContent(response.data.content);
      setEditedMood(response.data.mood || "neutral");
    } catch (error) {
      console.error("Error fetching entry:", error);
      alert("Entry not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedContent.trim()) return;

    setIsSaving(true);
    try {
      // First, re-analyze the mood with AI
      let updatedMood = editedMood;
      try {
        console.log("Analyzing mood for content:", editedContent.trim());
        const moodResponse = await axios.post(
          "http://localhost:5555/analyze-mood",
          {
            content: editedContent.trim(),
          }
        );
        console.log("Mood analysis response:", moodResponse.data);
        if (moodResponse.data && moodResponse.data.mood) {
          updatedMood = moodResponse.data.mood;
          setEditedMood(updatedMood);
          console.log("Updated mood to:", updatedMood);
        }
      } catch (moodError) {
        console.error("Error analyzing mood:", moodError);
        // Continue with current mood if analysis fails
      }

      // Then save the entry with the updated mood
      console.log("Saving entry with mood:", updatedMood);
      const response = await axios.patch(
        `http://localhost:5555/entries/${id}`,
        {
          title: entry.title,
          content: editedContent,
          mood: updatedMood,
          user_id: user.id, // Pass user_id for verification
        }
      );
      console.log("Save response:", response.data);
      setEntry(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating entry:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.status === 403) {
        alert("You can only edit your own entries");
      } else {
        alert("Failed to update entry");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(
        `http://localhost:5555/entries/${id}?user_id=${user.id}`
      );
      navigate("/");
    } catch (error) {
      console.error("Error deleting entry:", error);
      if (error.response?.status === 403) {
        alert("You can only delete your own entries");
      } else {
        alert("Failed to delete entry");
      }
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading entry...</p>
      </div>
    );
  }

  if (!entry) {
    return <div>Entry not found</div>;
  }

  const moodColors = getMoodColors(entry.mood);
  const textColor = getTextColor(entry.mood);
  const textShadow = getTextShadow(entry.mood);

  return (
    <div className="entry-detail">
      <div className="detail-header">
        <button
          className="back-button"
          onClick={() => navigate("/")}
          title="Back to Journal"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="header-actions">
          {entry && entry.user_id === user.id && (
            <>
              <button
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
                title={isEditing ? "Cancel" : "Edit"}
              >
                <Edit size={20} />
              </button>
              <button
                className="delete-button"
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="entry-content"
        style={{
          background: moodColors.gradient,
          borderRadius: "19.416px" /* 12 * 1.618 ≈ 19.416 */,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: textColor,
          textShadow: textShadow,
        }}
      >
        <div
          className="entry-meta"
          style={{
            padding: "38.832px 38.832px 25.888px 38.832px",
            position: "relative",
          }}
        >
          {" "}
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
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                placeholder="Entry title..."
                className="title-input"
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

        {isEditing ? (
          <div
            className="edit-form"
            style={{ padding: "0 38.832px 38.832px 38.832px" }}
          >
            {" "}
            {/* 24 * 1.618 ≈ 38.832 */}
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Write your entry content..."
              style={{
                width: "100%",
                minHeight: "323.6px" /* 200 * 1.618 ≈ 323.6 */,
                padding: "25.888px" /* 16 * 1.618 ≈ 25.888 */,
                border: "none",
                borderRadius: "12.944px" /* 8 * 1.618 ≈ 12.944 */,
                background: "rgba(255,255,255,0.15)",
                color: textColor,
                fontSize: "1.702rem" /* 1.052 * 1.618 ≈ 1.702 */,
                lineHeight: "1.6",
                resize: "vertical",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                fontWeight: "600",
                textShadow: textShadow,
              }}
            />
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background:
                  "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                color: "#667eea",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                padding:
                  "19.416px 40.45px" /* 12 * 1.618 ≈ 19.416, 25 * 1.618 ≈ 40.45 */,
                borderRadius: "16.18px" /* 10 * 1.618 ≈ 16.18 */,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8.09px" /* 5 * 1.618 ≈ 8.09 */,
                marginTop: "32.36px" /* 20 * 1.618 ≈ 32.36 */,
                fontWeight: "700",
                fontSize: "1.309rem" /* 0.809 * 1.618 ≈ 1.309 */,
                transition: "all 0.4s ease",
                textTransform: "uppercase",
                letterSpacing: "0.485px" /* 0.3 * 1.618 ≈ 0.485 */,
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div
            className="entry-text"
            style={{
              padding: "0 38.832px 38.832px 38.832px" /* 24 * 1.618 ≈ 38.832 */,
              fontSize: "1.702rem" /* 1.052 * 1.618 ≈ 1.702 */,
              lineHeight: "1.6",
              color: textColor,
              textShadow: textShadow,
              fontWeight: "600",
            }}
          >
            {entry.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryDetail;
