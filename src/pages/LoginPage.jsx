// frontend/src/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setMsg("");
    if (!userId || !password) {
      setMsg("User ID and password required");
      return;
    }

    setIsLoading(true);
    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await fetch(
        `${API_URL}/api/astronauts/login-and-decrypt`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password })
        }
      );

      const data = await res.json();
      if (!data.success) {
        setMsg(`❌ ${data.message}`);
        return;
      }

      // success → /details pe jao, decrypted profile state me bhejo
      navigate("/details", {
        state: {
          fromLogin: true,
          userId,
          profile: data.profile
        }
      });
    } catch (err) {
      console.error("Login error:", err);
      setMsg(`❌ Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Basic UI (tu apna design se style kar sakta hai)
  return (
    <div
      style={{
        maxWidth: 500,
        margin: "80px auto",
        padding: 24,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#e6eef8",
        fontFamily: "Inter, system-ui, Arial"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>
        🔐 Astronaut Login
      </h1>
      <p style={{ textAlign: "center", color: "#9fb4c9" }}>
        Enter your User ID and password to load your encrypted profile.
      </p>

      <div style={{ marginTop: 20 }}>
        <label style={{ display: "block", marginBottom: 6 }}>User ID</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. 24BPH030"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "#e6eef8"
          }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your secret password"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "#e6eef8"
          }}
        />
      </div>

      {msg && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 8,
            fontSize: 13,
            background: msg.startsWith("❌")
              ? "rgba(255,77,109,0.2)"
              : "rgba(0,255,179,0.2)",
            color: msg.startsWith("❌") ? "#ff4d6d" : "#00ffb3"
          }}
        >
          {msg}
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading || !userId || !password}
        style={{
          marginTop: 18,
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "none",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontWeight: 700,
          background: "linear-gradient(90deg,#00ffb3,#00d1ff)",
          color: "#042"
        }}
      >
        {isLoading ? "Loading..." : "Load profile & continue →"}
      </button>
    </div>
  );
}
