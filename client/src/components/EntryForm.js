import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getMoodColors,
  getMoodEmoji,
  getTextColor,
  getTextShadow,
} from "../utils/moodColors";
import "../styling/entryform.css";

const EntryForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async () => {
    // check if title and content are not empty (trim will remove whitespace from beginning and end)
    if (!title.trim() || !content.trim()) {
      setMessage("Please fill in both title and content");
      return;
    }

    setMessage(""); // Clear any previous messages

    setIsSubmitting(true);

    // If mood hasn't been analyzed yet, analyze it automatically
    if (mood === "neutral" && content.trim()) {
      try {
        const response = await fetch("http://localhost:5555/analyze-mood", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: content.trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          setMood(data.mood);
        }
      } catch (error) {
        console.error("Error auto-analyzing mood:", error);
        // Continue with neutral mood if analysis fails
      }
    }

    try {
      const response = await fetch("http://localhost:5555/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          mood: mood, // This will be the AI-analyzed mood
          user_id: user.id, // Use the logged-in user's ID
        }),
      });

      if (response.ok) {
        setMessage("Entry created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/"); // Go back to journal after showing success message
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(
          `Failed to create entry: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error creating entry:", error);
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="entry-form">
      <div className="form-header">
        <button
          className="back-button"
          onClick={() => navigate("/")}
          title="Back to Journal"
        >
          <ArrowLeft size={20} />
        </button>
        <h2>New Journal Entry</h2>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <form>
        <div className="form-group">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="title-input"
          />
        </div>

        <div className="form-group">
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="content-textarea"
          />
        </div>
      </form>

      {title && content && (
        <div className="preview-section">
          <button
            className="preview-toggle"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: "rgba(102, 126, 234, 0.1)",
              border: "1px solid rgba(102, 126, 234, 0.3)",
              color: "#667eea",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>

          {showPreview && (
            <div
              className="entry-preview"
              style={{
                background: getMoodColors(mood).gradient,
                borderRadius: "12px",
                padding: "20px",
                color: getTextColor(mood),
                textShadow: getTextShadow(mood),
                marginBottom: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "1.3rem",
                  color: getTextColor(mood),
                  textShadow: getTextShadow(mood),
                }}
              >
                {title}
              </h3>
              <div
                style={{
                  background: "transparent",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  display: "inline-block",
                  marginBottom: "12px",
                  fontSize: "0.9rem",
                  color: getTextColor(mood),
                  textShadow: getTextShadow(mood),
                  border: "none",
                }}
              >
                {getMoodEmoji(mood)} {mood}
              </div>
              <p
                style={{
                  margin: "0",
                  lineHeight: "1.6",
                  color: getTextColor(mood),
                  textShadow: getTextShadow(mood),
                }}
              >
                {content}
              </p>
            </div>
          )}
        </div>
      )}

      <button
        className="publish-button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publishing..." : "Publish Entry"}
      </button>
    </div>
  );
};

export default EntryForm;
