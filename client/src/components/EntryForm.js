import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Sparkles } from "lucide-react";
import "../styling/entryform.css";

const EntryForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
      <button className="publish-button">
        <Sparkles />
        Publish Entry
      </button>
    </div>
  );
};

export default EntryForm;
