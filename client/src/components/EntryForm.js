import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMoodColors, getMoodEmoji } from "../utils/moodColors";
import "../styling/entryform.css";

const EntryForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState("");

  const analyzeMood = async (content) => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
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
        setMessage("AI suggested mood: " + data.mood);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to analyze mood:", errorData);
        setMessage(
          "AI analysis failed: " + (errorData.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error analyzing mood:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
          <div className="mood-section">
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              style={{
                background: getMoodColors(mood).gradient,
                color: "#fff",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                fontWeight: "500",
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
            <button
              type="button"
              className="analyze-button"
              onClick={() => analyzeMood(content)}
              disabled={isAnalyzing || !content.trim()}
            >
              {isAnalyzing ? "🤖 Analyzing..." : "🤖 AI Suggest"}
            </button>
          </div>
        </div>
        <div className="form-group">
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
