// src/pages/PhysicalHealth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveHealthVitals } from "../services/api";

export default function PhysicalHealth() {
  const navigate = useNavigate();

  const [vitals, setVitals] = useState({
    heartRate: "",
    bloodPressure: "",
    spO2: "",
    temperature: "",
  });

  const [vitalStatus, setVitalStatus] = useState({
    heartRate: "NA",
    bloodPressure: "NA",
    spO2: "NA",
    temperature: "NA",
  });

  const [submitted, setSubmitted] = useState(false);

  const checkVitalStatus = (field, value) => {
    const numValue = parseFloat(value);

    switch (field) {
      case "heartRate":
        if (numValue < 60) return "Low";
        if (numValue > 100) return "High";
        return "Normal";

      case "spO2":
        if (numValue < 95) return "Low";
        if (numValue > 100) return "High";
        return "Normal";

      case "temperature":
        if (numValue < 36.5) return "Low";
        if (numValue > 37.5) return "High";
        return "Normal";

      case "bloodPressure":
        if (numValue < 120) return "Low";
        if (numValue > 130) return "High";
        return "Normal";

      default:
        return "NA";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim() !== "") {
      const status = checkVitalStatus(name, value);
      setVitalStatus((prev) => ({
        ...prev,
        [name]: status,
      }));
    } else {
      setVitalStatus((prev) => ({
        ...prev,
        [name]: "NA",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vitals.heartRate || !vitals.bloodPressure || !vitals.spO2 || !vitals.temperature) {
      alert("⚠️ Please fill all vital fields!");
      return;
    }

    const vitalData = {
      ...vitals,
      status: vitalStatus,
      timestamp: new Date().toLocaleString(),
    };

    sessionStorage.setItem("physicalVitals", JSON.stringify(vitalData));
    setSubmitted(true);

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
      const physicalData = {
        heartRate: vitals.heartRate,
        spO2: vitals.spO2,
        temperature: vitals.temperature,
      };

      // Parse blood pressure
      const bpParts = vitals.bloodPressure.split('/');
      if (bpParts.length === 2) {
        physicalData.systolicBP = parseFloat(bpParts[0]);
        physicalData.diastolicBP = parseFloat(bpParts[1]);
      }

      saveHealthVitals(userId, null, physicalData).then((result) => {
        if (result.success) {
          setTimeout(() => {
            alert(
              "✓ Physical health data recorded successfully!\n\nBackend ML model will compare with standard astronaut ranges."
            );
          }, 300);
        } else {
          console.error("Backend save error:", result.error);
          setTimeout(() => {
            alert(
              "✓ Data saved locally!\n⚠️ Note: Backend sync failed. Data will be used from local storage."
            );
          }, 300);
        }
      });
    } else {
      setTimeout(() => {
        alert("✓ Physical health data recorded successfully!\n\nBackend ML model will compare with standard astronaut ranges.");
      }, 300);
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all vitals?")) {
      setVitals({
        heartRate: "",
        bloodPressure: "",
        spO2: "",
        temperature: "",
      });
      setVitalStatus({
        heartRate: "NA",
        bloodPressure: "NA",
        spO2: "NA",
        temperature: "NA",
      });
      setSubmitted(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Normal") return "#00FFA5";
    if (status === "Low") return "#FF6400";
    if (status === "High") return "#FF006E";
    return "#888888";
  };

  return (
    <div className="page-layout">
      <section className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #00FFFF, #00FFA5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem",
            }}
          >
            📈 Physical Health Monitoring
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "1rem" }}>
            Enter astronaut's vital signs for real-time health monitoring
          </p>
          <div
            style={{
              background: "rgba(0, 255, 255, 0.1)",
              border: "1px solid #00FFFF",
              borderRadius: "8px",
              padding: "0.8rem",
              fontSize: "12px",
              color: "#00FFFF",
            }}
          >
            ℹ️ All data will be compared against standard astronaut health ranges using ML models
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Heart Rate */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0, 255, 255, 0.08), rgba(183, 0, 255, 0.08))",
              border: "2px solid #00FFFF",
              borderRadius: "12px",
              padding: "1.5rem",
              transition: "all 0.3s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: "700", color: "#00FFFF", marginBottom: "0.3rem", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ❤️ Heart Rate (bpm)
                </label>
                <small style={{ color: "#999", fontSize: "12px" }}>Normal Range: 60-100 bpm</small>
              </div>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: getStatusColor(vitalStatus.heartRate),
                  color: vitalStatus.heartRate === "Normal" ? "#000" : "#fff",
                  fontWeight: "700",
                  fontSize: "12px",
                }}
              >
                {vitalStatus.heartRate}
              </div>
            </div>
            <input
              type="number"
              name="heartRate"
              value={vitals.heartRate}
              onChange={handleInputChange}
              placeholder="e.g., 72"
              min="0"
              max="200"
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #00FFFF",
                borderRadius: "8px",
                background: "rgba(0, 255, 255, 0.05)",
                color: "#000",
                fontSize: "14px",
                fontWeight: "600",
                boxSizing: "border-box",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(0, 255, 255, 0.12)";
                e.target.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(0, 255, 255, 0.05)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Blood Pressure */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255, 0, 110, 0.08), rgba(183, 0, 255, 0.08))",
              border: "2px solid #FF006E",
              borderRadius: "12px",
              padding: "1.5rem",
              transition: "all 0.3s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: "700", color: "#FF006E", marginBottom: "0.3rem", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  🩸 Blood Pressure (mmHg)
                </label>
                <small style={{ color: "#999", fontSize: "12px" }}>Normal Range: 120/80 mmHg</small>
              </div>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: getStatusColor(vitalStatus.bloodPressure),
                  color: vitalStatus.bloodPressure === "Normal" ? "#000" : "#fff",
                  fontWeight: "700",
                  fontSize: "12px",
                }}
              >
                {vitalStatus.bloodPressure}
              </div>
            </div>
            <input
              type="text"
              name="bloodPressure"
              value={vitals.bloodPressure}
              onChange={handleInputChange}
              placeholder="e.g., 120/80"
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #FF006E",
                borderRadius: "8px",
                background: "rgba(255, 0, 110, 0.05)",
                color: "#000",
                fontSize: "14px",
                fontWeight: "600",
                boxSizing: "border-box",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(255, 0, 110, 0.12)";
                e.target.style.boxShadow = "0 0 15px rgba(255, 0, 110, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255, 0, 110, 0.05)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* SpO2 */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(57, 255, 20, 0.08), rgba(255, 255, 0, 0.08))",
              border: "2px solid #39FF14",
              borderRadius: "12px",
              padding: "1.5rem",
              transition: "all 0.3s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: "700", color: "#39FF14", marginBottom: "0.3rem", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  💨 Oxygen Saturation (SpO2) %
                </label>
                <small style={{ color: "#999", fontSize: "12px" }}>Normal Range: 95-100%</small>
              </div>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: getStatusColor(vitalStatus.spO2),
                  color: vitalStatus.spO2 === "Normal" ? "#000" : "#fff",
                  fontWeight: "700",
                  fontSize: "12px",
                }}
              >
                {vitalStatus.spO2}
              </div>
            </div>
            <input
              type="number"
              name="spO2"
              value={vitals.spO2}
              onChange={handleInputChange}
              placeholder="e.g., 98"
              min="0"
              max="100"
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #39FF14",
                borderRadius: "8px",
                background: "rgba(57, 255, 20, 0.05)",
                color: "#000",
                fontSize: "14px",
                fontWeight: "600",
                boxSizing: "border-box",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(57, 255, 20, 0.12)";
                e.target.style.boxShadow = "0 0 15px rgba(57, 255, 20, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(57, 255, 20, 0.05)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Temperature */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255, 165, 0, 0.08), rgba(255, 100, 0, 0.08))",
              border: "2px solid #FF9800",
              borderRadius: "12px",
              padding: "1.5rem",
              transition: "all 0.3s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: "700", color: "#FF9800", marginBottom: "0.3rem", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  🌡️ Body Temperature (°C)
                </label>
                <small style={{ color: "#999", fontSize: "12px" }}>Normal Range: 36.5-37.5°C</small>
              </div>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: getStatusColor(vitalStatus.temperature),
                  color: vitalStatus.temperature === "Normal" ? "#000" : "#fff",
                  fontWeight: "700",
                  fontSize: "12px",
                }}
              >
                {vitalStatus.temperature}
              </div>
            </div>
            <input
              type="number"
              name="temperature"
              value={vitals.temperature}
              onChange={handleInputChange}
              placeholder="e.g., 37.0"
              min="35"
              max="42"
              step="0.1"
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #FF9800",
                borderRadius: "8px",
                background: "rgba(255, 165, 0, 0.05)",
                color: "#000",
                fontSize: "14px",
                fontWeight: "600",
                boxSizing: "border-box",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(255, 165, 0, 0.12)";
                                e.target.style.boxShadow = "0 0 15px rgba(255, 165, 0, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255, 165, 0, 0.05)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
            <button
              type="submit"
              style={{
                padding: "14px 28px",
                background: "linear-gradient(135deg, #00FFFF, #00FFA5)",
                border: "none",
                borderRadius: "8px",
                color: "#000",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.6)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.3)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ✓ Submit Vitals
            </button>

            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: "14px 28px",
                background: "rgba(255, 100, 0, 0.15)",
                border: "2px solid #FF6400",
                borderRadius: "8px",
                color: "#FF6400",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(255, 100, 0, 0.3)";
                e.target.style.boxShadow = "0 0 15px rgba(255, 100, 0, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(255, 100, 0, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            >
              🔄 Clear All
            </button>
          </div>
        </form>

        {/* Success Message */}
        {submitted && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(0, 255, 165, 0.15), rgba(57, 255, 20, 0.15))",
              border: "2px solid #00FFA5",
              borderRadius: "10px",
              padding: "1.5rem",
              textAlign: "center",
              color: "#00FFA5",
              fontWeight: "700",
              fontSize: "14px",
              marginBottom: "1.5rem",
              animation: "fadeIn 0.5s ease-in",
            }}
          >
            ✓ Profile saved successfully! Ready for ML comparison.
          </div>
        )}

        {/* Vitals Summary Card */}
        {vitals.heartRate && vitals.bloodPressure && vitals.spO2 && vitals.temperature && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(183, 0, 255, 0.1), rgba(0, 255, 255, 0.1))",
              border: "2px solid #B700FF",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ color: "#B700FF", marginBottom: "1rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              📊 Vitals Summary
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              <div style={{ background: "rgba(0, 255, 255, 0.1)", padding: "1rem", borderRadius: "8px", border: "1px solid #00FFFF" }}>
                <small style={{ color: "#00FFFF", fontWeight: "600" }}>Heart Rate</small>
                <div style={{ color: "#00FFFF", fontSize: "18px", fontWeight: "700", marginTop: "0.3rem" }}>
                  {vitals.heartRate} bpm
                </div>
              </div>

              <div style={{ background: "rgba(255, 0, 110, 0.1)", padding: "1rem", borderRadius: "8px", border: "1px solid #FF006E" }}>
                <small style={{ color: "#FF006E", fontWeight: "600" }}>Blood Pressure</small>
                <div style={{ color: "#FF006E", fontSize: "18px", fontWeight: "700", marginTop: "0.3rem" }}>
                  {vitals.bloodPressure} mmHg
                </div>
              </div>

              <div style={{ background: "rgba(57, 255, 20, 0.1)", padding: "1rem", borderRadius: "8px", border: "1px solid #39FF14" }}>
                <small style={{ color: "#39FF14", fontWeight: "600" }}>SpO2</small>
                <div style={{ color: "#39FF14", fontSize: "18px", fontWeight: "700", marginTop: "0.3rem" }}>
                  {vitals.spO2} %
                </div>
              </div>

              <div style={{ background: "rgba(255, 165, 0, 0.1)", padding: "1rem", borderRadius: "8px", border: "1px solid #FF9800" }}>
                <small style={{ color: "#FF9800", fontWeight: "600" }}>Temperature</small>
                <div style={{ color: "#FF9800", fontSize: "18px", fontWeight: "700", marginTop: "0.3rem" }}>
                  {vitals.temperature} °C
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "2rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 20px",
              background: "rgba(255, 100, 0, 0.2)",
              border: "2px solid #FF6400",
              borderRadius: "6px",
              color: "#FF6400",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
              textTransform: "uppercase",
              fontSize: "12px",
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
            🏠 Home
          </button>

          <button
            onClick={() => navigate("/health-options")}
            style={{
              padding: "12px 20px",
              background: "rgba(255, 100, 0, 0.2)",
              border: "2px solid #FF6400",
              borderRadius: "6px",
              color: "#FF6400",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
              textTransform: "uppercase",
              fontSize: "12px",
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
            ← Back
          </button>

          <button
            onClick={() => navigate("/mental-health")}
            style={{
              padding: "12px 20px",
              background: "linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(200, 0, 255, 0.2))",
              border: "2px solid #FF006E",
              borderRadius: "6px",
              color: "#FF006E",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.3s",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "linear-gradient(135deg, rgba(255, 0, 110, 0.4), rgba(200, 0, 255, 0.4))";
              e.target.style.boxShadow = "0 0 15px rgba(255, 0, 110, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(200, 0, 255, 0.2))";
              e.target.style.boxShadow = "none";
            }}
          >
            Mental Health 🧠 →
          </button>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

