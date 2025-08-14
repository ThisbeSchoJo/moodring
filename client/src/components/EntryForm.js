import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Sparkles } from "lucide-react";
import "../styling/entryform.css";

const EntryForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    // check if title and content are not empty (trim will remove whitespace from beginning and end)
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
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
          user_id: 1, // For now, hardcoded to user 1
        }),
      });

      if (response.ok) {
        console.log("Entry created successfully!");
        navigate("/"); // Go back to journal
      } else {
        console.error("Failed to create entry");
      }
    } catch (error) {
      console.error("Error creating entry:", error);
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
          <label htmlFor="content">How are you feeling today?</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day, thoughts, feelings..."
          />
        </div>
      </form>
      <button className="publish-button" onClick={handleSubmit}>
        <Sparkles />
        Publish Entry
      </button>
    </div>
  );
};

export default EntryForm;
