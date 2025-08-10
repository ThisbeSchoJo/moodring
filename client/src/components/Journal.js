import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchEntries();
    fetchSummary();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/api/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/api/emotions/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your journal...</p>
      </div>
    );
  }

  return (
    <div className="journal">
      <div className="journal-header">
        <h2>Your Mood Journal</h2>
        <Link to="/new" className="new-entry-btn">
          <Plus size={20} />
          New Entry
        </Link>
      </div>

      {summary && summary.total_entries > 0 && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">
              <Heart size={24} />
            </div>
            <div className="summary-content">
              <h3>{summary.total_entries}</h3>
              <p>Total Entries</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <h3>{Object.keys(summary.emotion_counts).length}</h3>
              <p>Emotions Tracked</p>
            </div>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No journal entries yet</h3>
          <p>Start your mood journey by creating your first entry</p>
          <Link to="/new" className="cta-button">
            Write Your First Entry
          </Link>
        </div>
      ) : (
        <div className="entries-grid">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="entry-card"
              style={{
                borderLeft: `4px solid ${entry.emotion_analysis.color_assignment}`
              }}
            >
              <div className="entry-header">
                <div className="entry-date">
                  <Calendar size={16} />
                  {formatDate(entry.timestamp)}
                </div>
                <div
                  className="emotion-badge"
                  style={{
                    backgroundColor: entry.emotion_analysis.color_assignment
                  }}
                >
                  {entry.emotion_analysis.primary_emotion}
                </div>
              </div>
              <div className="entry-content">
                <p>{entry.content.substring(0, 150)}...</p>
              </div>
              <div className="entry-footer">
                <div className="emotion-tags">
                  {entry.emotion_analysis.emotion_tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="emotion-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`/entry/${entry.id}`} className="read-more">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;

