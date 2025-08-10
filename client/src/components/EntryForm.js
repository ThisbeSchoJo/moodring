import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Sparkles } from 'lucide-react';
import axios from 'axios';

const EntryForm = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/entries', { content });
      navigate(`/entry/${response.data.id}`);
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('Failed to create entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Show preview after user stops typing for 2 seconds
    if (newContent.trim().length > 10) {
      clearTimeout(window.previewTimeout);
      window.previewTimeout = setTimeout(async () => {
        try {
          const response = await axios.post('/api/entries', { content: newContent });
          setPreview(response.data.emotion_analysis);
        } catch (error) {
          console.error('Error getting preview:', error);
        }
      }, 2000);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="entry-form">
      <div className="form-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Journal
        </button>
        <h2>New Journal Entry</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="content">How are you feeling today?</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="Write about your day, your thoughts, your feelings... Let it all out."
            rows={10}
            required
          />
        </div>

        {preview && (
          <div className="emotion-preview">
            <div className="preview-header">
              <Sparkles size={16} />
              <span>AI Emotion Analysis</span>
            </div>
            <div className="preview-content">
              <div className="preview-item">
                <span className="preview-label">Primary Emotion:</span>
                <span className="preview-value">{preview.primary_emotion}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Intensity:</span>
                <span className="preview-value">{preview.emotion_intensity}/10</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Color:</span>
                <div
                  className="color-preview"
                  style={{ backgroundColor: preview.color_assignment }}
                ></div>
              </div>
              <div className="preview-item">
                <span className="preview-label">Tags:</span>
                <div className="emotion-tags">
                  {preview.emotion_tags.map((tag, index) => (
                    <span key={index} className="emotion-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Entry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;

