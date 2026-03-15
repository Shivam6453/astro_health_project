// src/components/BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "← Back to Home" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={{
        padding: "10px 20px",
        background: "rgba(255, 100, 0, 0.2)",
        border: "2px solid #FF6400",
        borderRadius: "6px",
        color: "#FF6400",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.3s",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
      onMouseOver={(e) => {
        e.target.style.background = "rgba(255, 100, 0, 0.4)";
        e.target.style.boxShadow = "0 0 15px rgba(255, 100, 0, 0.4)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "rgba(255, 100, 0, 0.2)";
        e.target.style.boxShadow = "none";
      }}
    >
      {label}
    </button>
  );
}
