import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styling/entryform.css";

const EntryForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    // check if title and content are not empty (trim will remove whitespace from beginning and end)
    if (!title.trim() || !content.trim()) {
      setMessage("Please fill in both title and content");
      return;
    }

    setMessage(""); // Clear any previous messages

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5555/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          mood: mood,
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
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Journal
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
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="mood">Mood</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="neutral">😐 Neutral</option>
            <option value="happy">😊 Happy</option>
            <option value="excited">🤩 Excited</option>
            <option value="calm">😌 Calm</option>
            <option value="sad">😢 Sad</option>
            <option value="angry">😠 Angry</option>
            <option value="anxious">😰 Anxious</option>
          </select>
        </div>
        <div className="form-group" >
          <label htmlFor="content">How are you feeling today?</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day, thoughts, feelings..."
          />
        </div>
      </form>
      <button
        className="publish-button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Sparkles />
        {isSubmitting ? "Publishing..." : "Publish Entry"}
      </button>
    </div>
  );
};

export default EntryForm;
