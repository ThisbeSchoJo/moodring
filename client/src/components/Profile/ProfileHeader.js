// ProfileHeader component - header section for the profile page with navigation and title
// Features: Back navigation, gradient text styling, responsive design
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfileHeader = () => {
  return (
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
        aria-label="Back to Journal"
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
  );
};

export default ProfileHeader;
