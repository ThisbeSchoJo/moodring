import React from "react";
import { User } from "lucide-react";
import ProfileStats from "./ProfileStats";
import { getMoodColors, createEntryGradient } from "../utils/moodColors";
import SparkleEffect from "./SparkleEffect";

const ProfileCard = ({ user, profile }) => {
  const profileColors = getMoodColors(profile.combined_mood);
  const profileGradient = createEntryGradient(profile.combined_mood, 0, 1, []);

  return (
    <div
      style={{
        background: profileGradient,
        borderRadius: "24px",
        padding: "3rem",
        marginBottom: "2rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SparkleEffect count={35} />

      {/* Shimmer effect overlay */}
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

      {/* Profile Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            <User size={40} color="white" />
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
                fontWeight: "700",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {user.username}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {profile.entry_count} journal entries
            </p>
          </div>
        </div>

        {/* Mood Analysis */}
        <div style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              margin: "0 0 1rem 0",
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              textTransform: "uppercase",
            }}
          >
            Your Emotional Profile
          </h3>

          {/* Mood Tags */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "20px",
                fontSize: "1.1rem",
                fontWeight: "600",
                textTransform: "uppercase",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {profile.dominant_mood}
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "20px",
                fontSize: "1.1rem",
                fontWeight: "600",
                textTransform: "uppercase",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {profile.secondary_mood}
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              margin: 0,
              fontSize: "1.2rem",
              lineHeight: "1.6",
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              background: "rgba(0,0,0,0.1)",
              padding: "1.5rem",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {profile.description}
          </p>
        </div>

        <ProfileStats profile={profile} />
      </div>
    </div>
  );
};

export default ProfileCard;
