// EntryForm component - form for creating new journal entries with AI mood analysis
// Features: Form validation, automatic mood detection, accessibility support, loading states
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styling/entryform.css";

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

    let finalMood = mood; // Start with current mood

    // Always analyze mood for new entries
    if (content.trim()) {
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
          finalMood = data.mood; // Use the analyzed mood
          setMood(data.mood); // Update the state as well
        }
      } catch (error) {
        console.error("Error auto-analyzing mood:", error);
        // Continue with current mood if analysis fails
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
          mood: finalMood, // Use the analyzed mood
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
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          aria-label="Back to Journal"
          title="Back to Journal"
          tabIndex={0}
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
          <label htmlFor="title" className="sr-only">
            Entry Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="title-input"
            aria-label="Entry title"
            aria-describedby="title-help"
          />
          <div id="title-help" className="sr-only">
            Enter a title for your journal entry
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content" className="sr-only">
            Entry Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="content-textarea"
            aria-label="Entry content"
            aria-describedby="content-help"
          />
          <div id="content-help" className="sr-only">
            Write your thoughts, feelings, or experiences
          </div>
        </div>
      </form>

      <button
        className="publish-button"
        onClick={handleSubmit}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={isSubmitting}
        aria-label="Publish journal entry"
        tabIndex={0}
      >
        {isSubmitting ? "Publishing..." : "Publish Entry"}
      </button>
    </div>
  );
};

export default EntryForm;
