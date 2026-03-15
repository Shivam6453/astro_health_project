import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveHealthVitals } from "../services/api";

export default function MentalHealth() {
  const navigate = useNavigate();

  const [wellness, setWellness] = useState({
    stress: 5,
    anxiety: 5,
    isolation: 5,
    focus: 5,
    sleep: 5,
    mood: 5,
  });

  const [moodCategory, setMoodCategory] = useState("neutral");

  const getColor = (v) =>
    v <= 3 ? "#00FF41" : v <= 6 ? "#FFD700" : "#FF6B6B";

  const handleSubmit = () => {
    sessionStorage.setItem(
      "mentalHealthAssessment",
      JSON.stringify({
        wellness,
        moodCategory,
        timestamp: new Date().toISOString(),
      })
    );

    // Get userId from stored profile
    const storedProfile = localStorage.getItem("fullProfile");
    let userId = null;

    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        userId = profile.userId;
      } catch (err) {
        console.error("Error parsing profile:", err);
      }
    }

    // Send to backend if userId exists
    if (userId) {
      const mentalData = {
        stress: wellness.stress,
        anxiety: wellness.anxiety,
        isolation: wellness.isolation,
        focus: wellness.focus,
        sleep: wellness.sleep,
        mood: wellness.mood,
        moodCategory: moodCategory,
      };

      saveHealthVitals(userId, mentalData, null).then((result) => {
        if (result.success) {
          alert("✓ Assessment saved to database!");
        } else {
          console.error("Backend save error:", result.error);
          alert("✓ Assessment saved locally!\n⚠️ Note: Backend sync failed.");
        }
      });
    } else {
      alert("✓ Assessment saved!");
    }
  };

  const handleClear = () => {
    setWellness({
      stress: 5,
      anxiety: 5,
      isolation: 5,
      focus: 5,
      sleep: 5,
      mood: 5,
    });
    setMoodCategory("neutral");
  };

  // FIXED SliderItem
  const SliderItem = ({ label, field, value }) => (
    <div style={{ marginBottom: "1.8rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.8rem",
        }}
      >
        <label style={{ fontSize: "1rem", fontWeight: "600" }}>{label}</label>
        <span
          style={{
            background: getColor(value),
            color: "#000",
            padding: "0.3rem 0.8rem",
            borderRadius: "20px",
            fontWeight: "700",
            fontSize: "0.9rem",
          }}
        >
          {value}/10
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) =>
          setWellness((prev) => ({
            ...prev,
            [field]: parseInt(e.target.value, 10),
          }))
        }
        style={{
          width: "100%",
          cursor: "pointer",
          accentColor: getColor(value),
          height: "6px",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "2rem",
        color: "#fff",
        fontFamily: "Segoe UI",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
          }}
        >
          🧠 Mental Health Check
        </h1>
        <p style={{ fontSize: "1rem", color: "#b0b0ff" }}>
          Wellness Assessment
        </p>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          border: "2px solid rgba(255,215,0,0.3)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.3rem",
            color: "#FFD700",
          }}
        >
          📊 Wellness Assessment
        </h2>

        <SliderItem
          label="Stress Level"
          field="stress"
          value={wellness.stress}
        />
        <SliderItem
          label="Anxiety Level"
          field="anxiety"
          value={wellness.anxiety}
        />
        <SliderItem
          label="Isolation Feeling"
          field="isolation"
          value={wellness.isolation}
        />
        <SliderItem
          label="Focus/Concentration"
          field="focus"
          value={wellness.focus}
        />
        <SliderItem
          label="Sleep Quality"
          field="sleep"
          value={wellness.sleep}
        />
        <SliderItem
          label="Overall Mood"
          field="mood"
          value={wellness.mood}
        />

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              display: "block",
              marginBottom: "0.8rem",
            }}
          >
            How would you describe your mood?
          </label>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {["happy", "neutral", "sad", "anxious", "energetic"].map((m) => (
              <button
                key={m}
                onClick={() => setMoodCategory(m)}
                style={{
                  padding: "0.8rem 1.5rem",
                  border:
                    moodCategory === m
                      ? "2px solid #00FFFF"
                      : "2px solid rgba(255,255,255,0.3)",
                  background:
                    moodCategory === m
                      ? "rgba(0,255,255,0.2)"
                      : "rgba(255,255,255,0.05)",
                  color: "#fff",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
          paddingBottom: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          🏠 Home
        </button>

        <button
          onClick={handleSubmit}
          style={{
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #00FF41, #00C800)",
            border: "none",
            borderRadius: "8px",
            color: "#000",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          💾 Save Assessment
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #FF6B6B, #FF1744)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          🗑️ Clear
        </button>

        <button
          onClick={() => navigate("/chatbot")}
          style={{
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #00FFFF, #B700FF)",
            border: "none",
            borderRadius: "8px",
            color: "#000",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(0,255,255,0.4)",
          }}
        >
          🤖 Astro_Friend Chat
        </button>

        <button
          onClick={() => navigate("/physical-health")}
          style={{
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #FF9500, #FF6B00)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          💪 Physical Health
        </button>
      </div>
    </div>
  );
}
