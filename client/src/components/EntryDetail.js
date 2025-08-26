import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EntryDetailHeader from "./EntryDetailHeader";
import EntryDetailContent from "./EntryDetailContent";
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
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:5555/entries/${id}`);
      setEntry(response.data);
      setEditedContent(response.data.content);
      setEditedMood(response.data.mood || "neutral");
    } catch (error) {
      console.error("Error fetching entry:", error);
      let errorMessage = "Failed to load entry";

      if (error.response?.status === 404) {
        errorMessage = "Entry not found";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to view this entry";
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedContent.trim()) {
      setError("Entry content cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // First, re-analyze the mood with AI
      let updatedMood = editedMood;
      try {
        const moodResponse = await axios.post(
          "http://localhost:5555/analyze-mood",
          {
            content: editedContent.trim(),
          }
        );
        if (moodResponse.data && moodResponse.data.mood) {
          updatedMood = moodResponse.data.mood;
          setEditedMood(updatedMood);
        }
      } catch (moodError) {
        console.error("Error analyzing mood:", moodError);
        // Continue with current mood if analysis fails
      }

      // Then save the entry with the updated mood
      const response = await axios.patch(
        `http://localhost:5555/entries/${id}`,
        {
          title: entry.title,
          content: editedContent,
          mood: updatedMood,
          user_id: user.id, // Pass user_id for verification
        }
      );
      setEntry(response.data);
      setIsEditing(false);
      setSuccessMessage("Entry updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating entry:", error);
      let errorMessage = "Failed to update entry";

      if (error.response?.status === 403) {
        errorMessage = "You can only edit your own entries";
      } else if (error.response?.status === 404) {
        errorMessage = "Entry not found";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.error || "Invalid entry data";
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this entry? This action cannot be undone."
      )
    )
      return;

    setError(null);
    try {
      await axios.delete(
        `http://localhost:5555/entries/${id}?user_id=${user.id}`
      );
      setSuccessMessage("Entry deleted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error deleting entry:", error);
      let errorMessage = "Failed to delete entry";

      if (error.response?.status === 403) {
        errorMessage = "You can only delete your own entries";
      } else if (error.response?.status === 404) {
        errorMessage = "Entry not found";
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
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

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/")}
            className="back-button"
            aria-label="Return to journal"
          >
            Return to Journal
          </button>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Entry Not Found</h2>
          <p>The entry you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/")}
            className="back-button"
            aria-label="Return to journal"
          >
            Return to Journal
          </button>
        </div>
      </div>
    );
  }

  const moodColors = getMoodColors(entry.mood);
  const textColor = getTextColor(entry.mood);
  const textShadow = getTextShadow(entry.mood);

  return (
    <div className="entry-detail">
      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <EntryDetailHeader
        onBack={() => navigate("/")}
        onEdit={() => setIsEditing(!isEditing)}
        onDelete={handleDelete}
        isEditing={isEditing}
        isSaving={isSaving}
        canEdit={entry && entry.user_id === user.id}
      />

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
        <EntryDetailContent
          entry={entry}
          isEditing={isEditing}
          onTitleChange={(e) => setEntry({ ...entry, title: e.target.value })}
          textColor={textColor}
          textShadow={textShadow}
        />

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
              aria-label="Edit entry content"
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
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              disabled={isSaving}
              aria-label="Save entry changes"
              role="button"
              tabIndex={0}
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
