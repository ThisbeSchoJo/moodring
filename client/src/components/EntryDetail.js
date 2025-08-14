import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, Heart } from "lucide-react";
// axios is used to make HTTP requests to the server (automatic JSON parsing, better error handling, request/response interceptors, request cancellation, progress monitoring)
import axios from "axios";

const EntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await axios.get(`http://localhost:5555/entries/${id}`);
      setEntry(response.data);
      setEditedContent(response.data.content);
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
      });
      setEntry(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update entry");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(`http://localhost:5555/entries/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
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

  return (
    <div className="entry-detail">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft />
          Back to Journal
        </button>
        <div className="header-actions">
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
        </div>
      </div>

      <div className="entry-content">
        <div className="entry-meta">
          <h1>{entry.title}</h1>
          <div className="entry-date">
            <Calendar />
            {formatDate(entry.created_at)}
          </div>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Write your entry content..."
            />
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="entry-text">{entry.content}</div>
        )}
      </div>
    </div>
  );
};

export default EntryDetail;
