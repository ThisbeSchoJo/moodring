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
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: textColor,
          textShadow: textShadow,
        }}
      >
        <div className="entry-meta" style={{ padding: "24px 24px 16px 24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {!isEditing ? (
              <h1
                style={{
                  margin: "0",
                  fontSize: "2rem",
                  fontWeight: "800",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                  textShadow: "none",
                  textTransform: "uppercase",
                  position: "relative",
                  transition: "all 0.3s ease",
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
                  fontSize: "2rem",
                  fontWeight: "800",
                  border: "none",
                  borderRadius: "0",
                  padding: "16px 0",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                  textShadow: "none",
                  textTransform: "uppercase",
                  position: "relative",
                  transition: "all 0.3s ease",
                  width: "100%",
                  color: textColor,
                }}
              />
            )}
            <div
              className="entry-date"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "1rem",
                color: "#ffffff",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                fontWeight: "500",
                opacity: "0.9",
                backgroundColor: "rgba(0,0,0,0.2)",
                padding: "4px 8px",
                borderRadius: "6px",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Calendar size={18} />
              {formatDate(entry.created_at)}
            </div>
          </div>
          <div
            className="entry-mood-display"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              alignItems: "center",
            }}
          >
            {parseMoods(entry.mood).map((mood, moodIndex) => (
              <div
                key={moodIndex}
                style={{
                  background: getMoodColors(mood).gradient,
                  color: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {mood}
              </div>
            ))}
          </div>
        </div>

        {isEditing ? (
          <div className="edit-form" style={{ padding: "0 24px 24px 24px" }}>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Write your entry content..."
              style={{
                width: "100%",
                minHeight: "200px",
                padding: "16px",
                border: "none",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                color: textColor,
                fontSize: "1.1rem",
                lineHeight: "1.6",
                resize: "vertical",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                fontWeight: "400",
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
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "20px",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.4s ease",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
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
              padding: "0 24px 24px 24px",
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: textColor,
              textShadow: textShadow,
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
