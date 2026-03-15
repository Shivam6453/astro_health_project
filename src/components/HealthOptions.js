// src/components/HealthOptions.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HealthOptions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null); // ← Add this

  return (
    <div className="page-layout">
      <section className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #00FFFF, #B700FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1rem",
            }}
          >
            🏥 Health Monitoring Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            Select a health check to monitor astronaut vitals
          </p>
        </div>

        {/* TWO MAIN BUTTONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Physical Health Button */}
          <button
            onClick={() => navigate("/physical-health")}
            style={{
              padding: "3rem 2rem",
              background: "linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 200, 0.1))",
              border: "3px solid #00FFFF",
              borderRadius: "15px",
              cursor: "pointer",
              transition: "all 0.3s",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 200, 0.2))";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 200, 0.1))";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📈</div>
            <h2 style={{ color: "#00FFFF", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              Physical Health
            </h2>
            <p style={{ color: "#00FFFF", fontSize: "14px" }}>
              Monitor vitals: Heart Rate, BP, SpO2, Temperature
            </p>
          </button>

          {/* Mental Health Button */}
          <button
            onClick={() => navigate("/mental-health")}
            style={{
              padding: "3rem 2rem",
              background: "linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(200, 0, 255, 0.1))",
              border: "3px solid #FF006E",
              borderRadius: "15px",
              cursor: "pointer",
              transition: "all 0.3s",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(200, 0, 255, 0.2))";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(255, 0, 110, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(200, 0, 255, 0.1))";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🧠</div>
            <h2 style={{ color: "#FF006E", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
              Mental Health
            </h2>
            <p style={{ color: "#FF006E", fontSize: "14px" }}>
              Chat with AI buddy & stress assessment
            </p>
          </button>
        </div>

                {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
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
            }}
            onMouseOver={(e) => (e.target.style.background = "rgba(255, 100, 0, 0.4)")}
            onMouseOut={(e) => (e.target.style.background = "rgba(255, 100, 0, 0.2)")}
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}
