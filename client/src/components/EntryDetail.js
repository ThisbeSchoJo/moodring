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
        <button>
          Back to Journal
        </button>
      </div>

      <div className="entry-content">
        <div className="entry-meta"></div>
      </div>

      <div className="emotion-analysis"></div>
    </div>
  );
};

export default EntryDetail;

