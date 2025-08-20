import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMoodColors, createEntryGradient } from "../utils/moodColors";
import { ArrowLeft, User, BookOpen, Heart } from "lucide-react";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sparkles, setSparkles] = useState([]);

  // Generate sparkling effect
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 35; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 3,
          delay: Math.random() * 2,
          duration: Math.random() * 1.5 + 0.8,
          type: Math.random() > 0.5 ? "star" : "circle",
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5555/user-profile/${user.id}`
        );
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Please log in to view your profile.</p>
        <Link to="/login" style={{ color: "#667eea", textDecoration: "none" }}>
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "1.2rem",
          color: "#4a5568",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto",
            }}
          />
          <p>Analyzing your journal entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#e53e3e", marginBottom: "1rem" }}>Error: {error}</p>
        <Link
          to="/journal"
          style={{ color: "#667eea", textDecoration: "none" }}
        >
          Back to Journal
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>No profile data available.</p>
        <Link
          to="/journal"
          style={{ color: "#667eea", textDecoration: "none" }}
        >
          Back to Journal
        </Link>
      </div>
    );
  }

  const profileColors = getMoodColors(profile.combined_mood);
  const profileGradient = createEntryGradient(profile.combined_mood, 0, 1, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "3rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "50%",
            textDecoration: "none",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <h1
          style={{
            margin: 0,
            fontSize: "2.5rem",
            fontWeight: "800",
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          Your Mood Profile
        </h1>
      </div>

      {/* Profile Card */}
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
        {/* Sparkling Effect */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            style={{
              position: "absolute",
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: sparkle.type === "star" ? "transparent" : "white",
              borderRadius: sparkle.type === "star" ? "0" : "50%",
              boxShadow:
                sparkle.type === "star"
                  ? "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.8), 0 0 45px rgba(255,255,255,0.6)"
                  : "0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)",
              animation: `sparkle ${sparkle.duration}s ease-in-out infinite`,
              animationDelay: `${sparkle.delay}s`,
              pointerEvents: "none",
              transform: sparkle.type === "star" ? "rotate(45deg)" : "none",
            }}
          >
            {sparkle.type === "star" && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "white",
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
              />
            )}
          </div>
        ))}

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

          {/* Stats */}
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
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/journal"
          style={{
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            color: "#667eea",
            border: "1px solid rgba(102, 126, 234, 0.2)",
            padding: "1rem 2rem",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          View Journal
        </Link>
        <Link
          to="/new-entry"
          style={{
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            color: "white",
            border: "1px solid transparent",
            padding: "1rem 2rem",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          New Entry
        </Link>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes sparkle {
            0% { 
              opacity: 0; 
              transform: scale(0) rotate(0deg);
            }
            25% {
              opacity: 0.8;
              transform: scale(1.2) rotate(90deg);
            }
            50% { 
              opacity: 1; 
              transform: scale(1) rotate(180deg);
            }
            75% {
              opacity: 0.8;
              transform: scale(1.2) rotate(270deg);
            }
            100% { 
              opacity: 0; 
              transform: scale(0) rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Profile;
