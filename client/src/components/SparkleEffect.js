import React, { useState, useEffect } from "react";

const SparkleEffect = ({ count = 35 }) => {
  const [sparkles, setSparkles] = useState([]);

  // Generate sparkling effect
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < count; i++) {
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
  }, [count]);

  return (
    <>
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

      {/* CSS Animations */}
      <style>
        {`
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
    </>
  );
};

export default SparkleEffect;
