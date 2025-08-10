import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Heart } from 'lucide-react';
import axios from 'axios';

const EntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await axios.get(`/api/entries/${id}`);
      setEntry(response.data);
      setEditedContent(response.data.content);
    } catch (error) {
      console.error('Error fetching entry:', error);
      alert('Entry not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedContent.trim()) return;

    setIsSaving(true);
    try {
      const response = await axios.put(`/api/entries/${id}`, {
        content: editedContent
      });
      setEntry(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await axios.delete(`/api/entries/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Journal
        </button>
        <div className="header-actions">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="edit-btn"
          >
            <Edit size={16} />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} className="delete-btn">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="entry-content">
        <div className="entry-meta">
          <div className="entry-date">
            <Calendar size={16} />
            {formatDate(entry.timestamp)}
          </div>
          <div
            className="emotion-badge large"
            style={{
              backgroundColor: entry.emotion_analysis.color_assignment
            }}
          >
            {entry.emotion_analysis.primary_emotion}
          </div>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={15}
              className="edit-textarea"
            />
            <div className="edit-actions">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="save-btn"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="entry-text">
            <p>{entry.content}</p>
          </div>
        )}
      </div>

      <div className="emotion-analysis">
        <h3>Emotion Analysis</h3>
        <div className="analysis-grid">
          <div className="analysis-card">
            <div className="analysis-icon">
              <Heart size={20} />
            </div>
            <div className="analysis-content">
              <h4>Primary Emotion</h4>
              <p>{entry.emotion_analysis.primary_emotion}</p>
            </div>
          </div>

          <div className="analysis-card">
            <div className="analysis-icon">
              <div className="intensity-meter">
                <div
                  className="intensity-fill"
                  style={{
                    width: `${(entry.emotion_analysis.emotion_intensity / 10) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div className="analysis-content">
              <h4>Intensity</h4>
              <p>{entry.emotion_analysis.emotion_intensity}/10</p>
            </div>
          </div>

          <div className="analysis-card">
            <div className="analysis-icon">
              <div
                className="color-display"
                style={{
                  backgroundColor: entry.emotion_analysis.color_assignment
                }}
              ></div>
            </div>
            <div className="analysis-content">
              <h4>Color Assignment</h4>
              <p>{entry.emotion_analysis.color_assignment}</p>
            </div>
          </div>
        </div>

        <div className="emotion-tags-section">
          <h4>Emotion Tags</h4>
          <div className="emotion-tags">
            {entry.emotion_analysis.emotion_tags.map((tag, index) => (
              <span key={index} className="emotion-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryDetail;

