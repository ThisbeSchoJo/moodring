import React from "react";
import { BookOpen, Heart } from "lucide-react";

const ProfileStats = ({ profile }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "1.5rem",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          flex: "1",
          minWidth: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <BookOpen size={20} color="white" />
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Total Entries
          </span>
        </div>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {profile.entry_count}
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "1.5rem",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          flex: "1",
          minWidth: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <Heart size={20} color="white" />
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Dominant Mood
          </span>
        </div>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "white",
            textTransform: "uppercase",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {profile.dominant_mood}
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
