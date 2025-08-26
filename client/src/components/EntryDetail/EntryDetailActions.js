// useEntryDetailActions hook - manages save and delete operations for journal entries
// Features: AI mood re-analysis, error handling, loading states, user confirmation for deletion
import { useState } from "react";
import axios from "axios";
import { handleApiError, ERROR_CONTEXTS } from "../../utils/errorHandling";

const useEntryDetailActions = (
  id,
  user,
  entry,
  setEntry,
  setIsEditing,
  setError,
  setSuccessMessage,
  navigate
) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (editedContent) => {
    if (!editedContent.trim()) {
      setError("Entry content cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // First, re-analyze the mood with AI
      let updatedMood = entry.mood;
      try {
        const moodResponse = await axios.post(
          "http://localhost:5555/analyze-mood",
          {
            content: editedContent.trim(),
          }
        );
        if (moodResponse.data && moodResponse.data.mood) {
          updatedMood = moodResponse.data.mood;
        }
      } catch (moodError) {
        // Continue with current mood if analysis fails
        // Don't show error to user since this is background analysis
      }

      // Then save the entry with the updated mood
      const response = await axios.patch(
        `http://localhost:5555/entries/${id}`,
        {
          title: entry.title,
          content: editedContent,
          mood: updatedMood,
          user_id: user.id, // Pass user_id for verification
        }
      );
      setEntry(response.data);
      setIsEditing(false);
      setSuccessMessage("Entry updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      const errorMessage = handleApiError(error, ERROR_CONTEXTS.UPDATE_ENTRY);
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this entry? This action cannot be undone."
      )
    )
      return;

    setError(null);
    try {
      await axios.delete(
        `http://localhost:5555/entries/${id}?user_id=${user.id}`
      );
      setSuccessMessage("Entry deleted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const errorMessage = handleApiError(error, ERROR_CONTEXTS.DELETE_ENTRY);
      setError(errorMessage);
    }
  };

  return {
    isSaving,
    handleSave,
    handleDelete,
  };
};

export default useEntryDetailActions;
