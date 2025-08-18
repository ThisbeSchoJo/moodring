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
      const response = await axios.put(`http://localhost:5555/entries/${id}`, {
        content: editedContent,
        mood: editedMood,
        user_id: user.id, // Pass user_id for verification
      });
      setEntry(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating entry:", error);
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
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft />
          Back to Journal
        </button>
        <div className="header-actions">
          {entry && entry.user_id === user.id && (
            <>
              <button
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
              >
                <Edit />
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button className="delete-button" onClick={handleDelete}>
                <Trash2 />
                Delete
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
          <h1
            style={{
              color: textColor,
              marginBottom: "16px",
              textShadow: textShadow,
            }}
          >
            {entry.title}
          </h1>
          <div
            className="entry-info"
            style={{ display: "flex", gap: "16px", alignItems: "center" }}
          >
            <div
              className="entry-date"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: "0.9",
                fontSize: "0.95rem",
                color: textColor,
                textShadow: textShadow,
              }}
            >
              <Calendar size={18} />
              {formatDate(entry.created_at)}
            </div>
            <div
              className="entry-mood-display"
              style={{
                background: "transparent",
                padding: "8px 16px",
                borderRadius: "20px",
                color: textColor,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(10px)",
                border: "none",
                textShadow: textShadow,
              }}
            >
              <Heart size={16} />
              <span>{getMoodEmoji(entry.mood)}</span>
              <span>{parseMoods(entry.mood).join(", ")}</span>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="edit-form" style={{ padding: "0 24px 24px 24px" }}>
            <div className="edit-mood" style={{ marginBottom: "16px" }}>
              <label
                htmlFor="mood"
                style={{
                  color: textColor,
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  textShadow: textShadow,
                }}
              >
                Mood:
              </label>
              <select
                id="mood"
                value={editedMood}
                onChange={(e) => setEditedMood(e.target.value)}
                style={{
                  background: getMoodColors(editedMood).gradient,
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                <option value="neutral">😐 Neutral</option>
                <option value="happy">😊 Happy</option>
                <option value="excited">🤩 Excited</option>
                <option value="grateful">🙏 Grateful</option>
                <option value="hopeful">✨ Hopeful</option>
                <option value="calm">😌 Calm</option>
                <option value="sad">😢 Sad</option>
                <option value="angry">😠 Angry</option>
                <option value="anxious">😰 Anxious</option>
                <option value="confused">😕 Confused</option>
              </select>
            </div>
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
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "1rem",
                lineHeight: "1.6",
                resize: "vertical",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                marginTop: "16px",
                padding: "12px 24px",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s",
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
