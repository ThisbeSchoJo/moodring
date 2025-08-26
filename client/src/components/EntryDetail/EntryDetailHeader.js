// EntryDetailHeader component - navigation and action buttons for entry detail view
// Features: Back navigation, edit/delete actions, accessibility support, conditional rendering
import React from "react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

const EntryDetailHeader = ({
  onBack,
  onEdit,
  onDelete,
  isEditing,
  isSaving,
  canEdit,
}) => {
  return (
    <div className="detail-header">
      <button
        className="back-button"
        onClick={onBack}
        onKeyDown={(e) => e.key === "Enter" && onBack()}
        aria-label="Back to Journal"
        title="Back to Journal"
        tabIndex={0}
      >
        <ArrowLeft size={20} />
      </button>
      <div className="header-actions">
        {canEdit && (
          <>
            <button
              className="edit-button"
              onClick={onEdit}
              onKeyDown={(e) => e.key === "Enter" && onEdit()}
              disabled={isSaving}
              aria-label={isEditing ? "Cancel editing" : "Edit entry"}
              title={isEditing ? "Cancel" : "Edit"}
              tabIndex={0}
            >
              <Edit size={20} />
            </button>
            <button
              className="delete-button"
              onClick={onDelete}
              onKeyDown={(e) => e.key === "Enter" && onDelete()}
              aria-label="Delete entry"
              title="Delete"
              tabIndex={0}
            >
              <Trash2 size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EntryDetailHeader;
