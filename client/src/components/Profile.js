import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import axios from "axios";

import ProfileCard from "./ProfileCard";
import ProfileHeader from "./ProfileHeader";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <ProfileHeader />

      <ProfileCard user={user} profile={profile} />

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
          

        `}
      </style>
    </div>
  );
};

export default Profile;
