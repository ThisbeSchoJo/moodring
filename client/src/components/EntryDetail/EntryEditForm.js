import React from "react";

const EntryEditForm = ({
  entry,
  editedContent,
  onContentChange,
  onSave,
  isSaving,
  textColor,
  textShadow,
}) => {
  return (
    <div
      style={{
        padding: "0 38.832px 38.832px 38.832px",
        position: "relative",
      }}
    >
      {/* 24 * 1.618 ≈ 38.832 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32.36px" /* 20 * 1.618 ≈ 32.36 */,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16.18px" /* 10 * 1.618 ≈ 16.18 */,
          }}
        >
          <label
            htmlFor="content"
            style={{
              fontSize: "1.309rem" /* 0.809 * 1.618 ≈ 1.309 */,
              fontWeight: "700",
              color: textColor,
              textShadow: textShadow,
            }}
          >
            Entry Content
          </label>
          <textarea
            id="content"
            value={editedContent}
            onChange={onContentChange}
            placeholder="What's on your mind?"
            className="content-textarea"
            aria-label="Edit entry content"
            style={{
              width: "100%",
              minHeight: "300px",
              padding: "25.888px" /* 16 * 1.618 ≈ 25.888 */,
              fontSize: "1.702rem" /* 1.052 * 1.618 ≈ 1.702 */,
              fontWeight: "600",
              lineHeight: "1.6",
              color: textColor,
              textShadow: textShadow,
              border: "none",
              borderRadius: "0",
              background: "transparent",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16.18px" /* 10 * 1.618 ≈ 16.18 */,
          }}
        >
          <button
            className="save-button"
            onClick={onSave}
            disabled={isSaving}
            aria-label="Save changes"
            title="Save changes"
            tabIndex={0}
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              color: "white",
              border: "1px solid transparent",
              padding:
                "16.18px 32.36px" /* 10 * 1.618 ≈ 16.18, 20 * 1.618 ≈ 32.36 */,
              borderRadius: "16.18px" /* 10 * 1.618 ≈ 16.18 */,
              fontSize: "1.309rem" /* 0.809 * 1.618 ≈ 1.309 */,
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              position: "relative",
              overflow: "hidden",
              minWidth: "120px",
            }}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
          >
            {isSaving ? "Saving..." : "Save Changes"}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                transition: "left 0.5s ease",
                pointerEvents: "none",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryEditForm;
