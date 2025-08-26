import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EntryDetailHeader from "./EntryDetailHeader";
import EntryDetailContent from "./EntryDetailContent";
import EntryEditForm from "./EntryEditForm";
import useEntryDetailActions from "./EntryDetailActions";
import { useAuth } from "../context/AuthContext";
// axios is used to make HTTP requests to the server (automatic JSON parsing, better error handling, request/response interceptors, request cancellation, progress monitoring)
import axios from "axios";
import {
  getMoodColors,
  getTextColor,
  getTextShadow,
} from "../utils/moodColors";
import { handleApiError, ERROR_CONTEXTS } from "../utils/errorHandling";
import "../styling/entrydetail.css";

const EntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Use custom hook for entry actions
  const { isSaving, handleSave, handleDelete } = useEntryDetailActions(
    id,
    user,
    entry,
    setEntry,
    setIsEditing,
    setError,
    setSuccessMessage,
    navigate
  );

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:5555/entries/${id}`);
      setEntry(response.data);
      setEditedContent(response.data.content);
    } catch (error) {
      const errorMessage = handleApiError(error, ERROR_CONTEXTS.FETCH_ENTRY);
      setError(errorMessage);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } finally {
      setLoading(false);
    }
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
          <EntryEditForm
            entry={entry}
            editedContent={editedContent}
            onContentChange={(e) => setEditedContent(e.target.value)}
            onSave={() => handleSave(editedContent)}
            isSaving={isSaving}
            textColor={textColor}
            textShadow={textShadow}
          />
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
