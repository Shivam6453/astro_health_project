// src/components/DetailsForm.js

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encryptFormData } from "../utils/encryptionUtil";

const emptyProfile = {
  fullName: "",
  age: "",
  height: "",
  weight: "",
  bloodType: "",
  medicalHistory: "",
  allergies: "",
  medications: "",
  fitnessLevel: "",
  previousMissions: "",
  emergencyContact: "",
  notes: "",
  userId: "",
  password: "",
  confirmPassword: ""
};

export default function AstronautDetails() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ ...emptyProfile });
  const [touched, setTouched] = useState({});
  const [savedAt, setSavedAt] = useState(
    () => localStorage.getItem("fullProfileSavedAt") || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Login (load from server) state
  const [loginUserId, setLoginUserId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const hasSavedProfile = (() => {
    try {
      return Boolean(localStorage.getItem("fullProfile"));
    } catch {
      return false;
    }
  })();

  const update = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const onBlur = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const errors = useMemo(() => {
    const e = {};

    if (!profile.fullName || profile.fullName.trim() === "")
      e.fullName = "Full name required";
    if (!profile.age || !/^\d+$/.test(profile.age) || Number(profile.age) <= 0)
      e.age = "Valid age required";
    if (
      !profile.height ||
      isNaN(Number(profile.height)) ||
      Number(profile.height) <= 0
    )
      e.height = "Valid height required";
    if (
      !profile.weight ||
      isNaN(Number(profile.weight)) ||
      Number(profile.weight) <= 0
    )
      e.weight = "Valid weight required";
    if (!profile.bloodType || profile.bloodType.trim() === "")
      e.bloodType = "Blood type required";
    if (!profile.medicalHistory || profile.medicalHistory.trim() === "")
      e.medicalHistory = "Medical history required";
    if (!profile.allergies || profile.allergies.trim() === "")
      e.allergies = "Allergies required (enter 'None' if none')";
    if (!profile.medications || profile.medications.trim() === "")
      e.medications = "Medications required (enter 'None' if none')";
    if (!profile.fitnessLevel || profile.fitnessLevel.trim() === "")
      e.fitnessLevel = "Choose fitness level";
    if (!profile.previousMissions || profile.previousMissions.trim() === "")
      e.previousMissions = "Previous missions required (enter 'None' if none')";
    if (!profile.emergencyContact || profile.emergencyContact.trim() === "")
      e.emergencyContact = "Emergency contact required";

    // Credentials validation
    if (!profile.userId || profile.userId.trim() === "") {
      e.userId = "User ID required";
    }
    if (!profile.password || profile.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }
    if (profile.password !== profile.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    return e;
  }, [profile]);

  const isValid = Object.keys(errors).length === 0;

  const loadSavedProfile = () => {
    try {
      const raw = localStorage.getItem("fullProfile");
      if (!raw) {
        alert("No saved profile found.");
        return;
      }
      const obj = JSON.parse(raw);
      setProfile({
        fullName: obj.fullName ?? "",
        age: obj.age != null ? String(obj.age) : "",
        height: obj.height != null ? String(obj.height) : "",
        weight: obj.weight != null ? String(obj.weight) : "",
        bloodType: obj.bloodType ?? "",
        medicalHistory: obj.medicalHistory ?? "",
        allergies: obj.allergies ?? "",
        medications: obj.medications ?? "",
        fitnessLevel: obj.fitnessLevel ?? "",
        previousMissions: obj.previousMissions ?? "",
        emergencyContact: obj.emergencyContact ?? "",
        notes: obj.notes ?? "",
        userId: obj.userId ?? "",
        password: "",
        confirmPassword: ""
      });
      setTouched({});
      setSavedAt(localStorage.getItem("fullProfileSavedAt") || null);
      alert("✅ Last saved profile loaded into the form.");
    } catch (err) {
      console.error("Load error:", err);
      alert("❌ Could not load saved profile (corrupt data).");
    }
  };

  const doClear = () => {
    if (!window.confirm("Clear saved profile and reset form?")) return;
    localStorage.removeItem("fullProfile");
    localStorage.removeItem("fullProfileSavedAt");
    localStorage.removeItem("astroDetailsFilled");
    setProfile({ ...emptyProfile });
    setTouched({});
    setSavedAt(null);
    setSuccessMessage("");
    alert("✅ Saved profile cleared. Form reset.");
  };

  const showFillFirst = () => {
    alert("❌ Fill your details first");
    setTouched(
      Object.keys(emptyProfile).reduce((a, k) => ({ ...a, [k]: true }), {})
    );
  };

  // Save Locally (without password fields)
  const doSaveLocal = (astronautId = null) => {
    const { password, confirmPassword, ...rest } = profile;
    const payload = {
      ...rest,
      age: Number(profile.age),
      height: Number(profile.height),
      weight: Number(profile.weight),
      savedAt: new Date().toISOString()
    };
    if (astronautId) {
      payload.astronautId = astronautId;
    }
    localStorage.setItem("fullProfile", JSON.stringify(payload));
    localStorage.setItem("fullProfileSavedAt", payload.savedAt);
    localStorage.setItem("astroDetailsFilled", "true");
    setSavedAt(payload.savedAt);
  };

  const doSave = () => {
    setTouched(
      Object.keys(emptyProfile).reduce((a, k) => ({ ...a, [k]: true }), {})
    );
    if (!isValid) {
      showFillFirst();
      return;
    }
    doSaveLocal();
    setSuccessMessage("✅ Profile saved locally successfully.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const buildProfileData = () => ({
    fullName: profile.fullName,
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    bloodType: profile.bloodType,
    medicalHistory: profile.medicalHistory,
    allergies: profile.allergies,
    medications: profile.medications,
    fitnessLevel: profile.fitnessLevel,
    previousMissions: profile.previousMissions,
    emergencyContact: profile.emergencyContact,
    notes: profile.notes,
    savedAt: new Date().toISOString()
  });

  const doExport = async () => {
    setTouched(
      Object.keys(emptyProfile).reduce((a, k) => ({ ...a, [k]: true }), {})
    );
    if (!isValid) {
      showFillFirst();
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");

    const profileData = buildProfileData();
    const encryptedData = encryptFormData(profileData);

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${API_URL}/api/astronauts/save-astronaut-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            astronautData: encryptedData,
            userId: profile.userId,
            password: profile.password
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        doSaveLocal(data.astronautId);

        const successMsg = `✅ Profile saved securely!\n\nBlockchain Hash:\n${data.blockchainHash.substring(
          0,
          32
        )}...\n\nAstronaut ID:\n${data.astronautId}`;
        alert(successMsg);
        setSuccessMessage(successMsg);
      } else {
        alert(`❌ Error: ${data.message}`);
        setSuccessMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert(`❌ Failed to save encrypted profile: ${error.message}`);
      setSuccessMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const doContinue = async () => {
    setTouched(
      Object.keys(emptyProfile).reduce((a, k) => ({ ...a, [k]: true }), {})
    );
    if (!isValid) {
      showFillFirst();
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");

    const profileData = buildProfileData();
    const encryptedData = encryptFormData(profileData);

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${API_URL}/api/astronauts/save-astronaut-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            astronautData: encryptedData,
            userId: profile.userId,
            password: profile.password
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        doSaveLocal(data.astronautId);

        alert(
          `✅ Profile saved securely!\n\nBlockchain Hash: ${data.blockchainHash.substring(
            0,
            32
          )}...`
        );

        navigate("/health-options");
      } else {
        alert(`❌ Error: ${data.message}`);
        setSuccessMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Continue error:", error);
      alert(`❌ Failed to save profile: ${error.message}`);
      setSuccessMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Load from server (login + decrypt)
  const handleLoadFromServer = async () => {
    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await fetch(
        `${API_URL}/api/astronauts/login-and-decrypt`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: loginUserId,
            password: loginPassword
          })
        }
      );

      const data = await res.json();
      if (!data.success) {
        alert(`❌ ${data.message}`);
        return;
      }

      const p = data.profile;

      setProfile((old) => ({
        ...old,
        fullName: p.fullName || "",
        age: p.age != null ? String(p.age) : "",
        height: p.height != null ? String(p.height) : "",
        weight: p.weight != null ? String(p.weight) : "",
        bloodType: p.bloodType || "",
        medicalHistory: p.medicalHistory || "",
        allergies: p.allergies || "",
        medications: p.medications || "",
        fitnessLevel: p.fitnessLevel || "",
        previousMissions: p.previousMissions || "",
        emergencyContact: p.emergencyContact || "",
        notes: p.notes || "",
        userId: loginUserId,
        password: "",
        confirmPassword: ""
      }));
      setTouched({});
      alert("✅ Profile decrypted and loaded from server.");
    } catch (err) {
      console.error("Login/decrypt error:", err);
      alert(`❌ Failed to load profile: ${err.message}`);
    }
  };

  // DARK STYLES (container + sections)
  const container = {
    maxWidth: 1100,
    margin: "20px auto 40px",
    fontFamily: "Inter, system-ui, Arial",
    color: "#e6eef8",
    background:
      "radial-gradient(circle at top, #1f3c5d 0, #050814 45%, #02030a 100%)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    border: "1px solid rgba(0,255,255,0.08)"
  };
  const headerH1 = {
    fontSize: 30,
    color: "#9be7ff",
    margin: 0,
    fontWeight: 800
  };
  const hint = { color: "#9fb4c9", marginTop: 6 };
  const sectionBox = (borderColor) => ({
    border: `1px solid ${borderColor}`,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    background:
      "linear-gradient(145deg, rgba(15,30,50,0.9), rgba(3,8,20,0.95))",
    boxShadow: "0 18px 40px rgba(0,0,0,0.45)"
  });
  const labelStyle = {
    color: "#9be7ff",
    fontWeight: 700,
    marginBottom: 6,
    display: "block"
  };
  const baseInput = {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    background: "rgba(2,10,25,0.9)",
    color: "#e6eef8",
    outline: "none",
    boxSizing: "border-box",
    fontSize: 14
  };
  const styleFor = (name) => ({
    ...baseInput,
    border:
      touched[name] && errors[name]
        ? "2px solid #ff4d6d"
        : "1px solid rgba(155,231,255,0.25)",
    boxShadow:
      touched[name] && errors[name]
        ? "0 0 0 1px rgba(255,77,109,0.4)"
        : "0 0 0 1px rgba(0,0,0,0.7)",
    opacity: isSaving ? 0.6 : 1,
    cursor: isSaving ? "not-allowed" : "text"
  });

  const topActionRow = {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    marginBottom: 12,
    alignItems: "center",
    flexWrap: "wrap"
  };
  const topBtn = {
    padding: "8px 14px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    opacity: isSaving ? 0.6 : 1,
    transition: "all 0.2s",
    border: "none"
  };

  const buttonsRow = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 12
  };
  const btnBase = {
    padding: "12px 20px",
    borderRadius: 999,
    minWidth: 150,
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s",
    letterSpacing: 0.3
  };
  const btnStyle = (activeGradient, isActive) => ({
    ...btnBase,
    background: isActive ? activeGradient : "rgba(15,25,40,0.9)",
    color: isActive ? "#02120d" : "#7a8798",
    boxShadow: isActive
      ? "0 10px 30px rgba(0,255,210,0.35)"
      : "0 0 0 rgba(0,0,0,0)",
    opacity: isSaving ? 0.6 : 1,
    pointerEvents: isSaving ? "none" : "auto"
  });

  const messageStyle = {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    background: successMessage.includes("❌")
      ? "linear-gradient(90deg,rgba(255,77,109,0.15),rgba(90,0,40,0.6))"
      : "linear-gradient(90deg,rgba(0,255,179,0.12),rgba(0,120,255,0.45))",
    color: successMessage.includes("❌") ? "#ffb3c1" : "#c1fff0",
    border: `1px solid ${
      successMessage.includes("❌")
        ? "rgba(255,77,109,0.6)"
        : "rgba(0,255,210,0.55)"
    }`,
    fontSize: 13,
    fontWeight: 600,
    backdropFilter: "blur(10px)"
  };

  return (
    <div style={container}>
      <header style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={headerH1}>👩‍🚀 Astronaut Health Profile</h1>
        <p style={hint}>
          Form starts empty. Click "Load last saved profile" to restore previous
          values (if any).
        </p>
      </header>

      {successMessage && <div style={messageStyle}>{successMessage}</div>}

      {/* Load decrypted profile from server */}
      <div style={sectionBox("rgba(90,140,255,0.7)")}>
        <h2 style={{ margin: "0 0 12px 0", color: "#9be7ff" }}>
          🔓 Load My Saved Profile
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: 12
          }}
        >
          <div>
            <label style={labelStyle}>User ID</label>
            <input
              value={loginUserId}
              onChange={(e) => setLoginUserId(e.target.value)}
              placeholder="Enter your User ID"
              style={styleFor("loginUserId")}
              disabled={isSaving}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter your password"
              style={styleFor("loginPassword")}
              disabled={isSaving}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={handleLoadFromServer}
              disabled={isSaving || !loginUserId || !loginPassword}
              style={btnStyle("linear-gradient(90deg,#00ffb3,#00d1ff)", true)}
            >
              Load from server
            </button>
          </div>
        </div>
      </div>

      <div style={topActionRow}>
        <div style={{ color: "#9fb4c9", fontSize: 13 }}>
          Saved profile: {hasSavedProfile ? "✅ Available" : "❌ None"}
        </div>
        <button
          onClick={loadSavedProfile}
          disabled={isSaving}
          style={{
            ...topBtn,
            background: hasSavedProfile
              ? "linear-gradient(90deg,#00ffb3,#00d1ff)"
              : "rgba(30,40,60,0.95)",
            color: hasSavedProfile ? "#042" : "#7b8494",
            boxShadow: hasSavedProfile
              ? "0 8px 22px rgba(0,255,210,0.35)"
              : "none"
          }}
          title={
            hasSavedProfile
              ? "Load last saved profile into form"
              : "No saved profile"
          }
        >
          📂 Load last saved profile
        </button>

        <button
          onClick={doClear}
          disabled={isSaving}
          style={{
            ...topBtn,
            background: "transparent",
            color: "#ff8b66",
            border: "1px solid rgba(255,139,102,0.45)"
          }}
          title="Clear saved profile and reset form"
        >
          🧹 Start fresh
        </button>
      </div>

      {/* Personal Information */}
      <div style={sectionBox("rgba(0,255,255,0.55)")}>
        <h2 style={{ margin: "0 0 12px 0", color: "#00ffff" }}>
          📋 Personal Information
        </h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              value={profile.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              onBlur={() => onBlur("fullName")}
              placeholder="Astronaut's full name"
              style={styleFor("fullName")}
              disabled={isSaving}
            />
            {touched.fullName && errors.fullName && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.fullName}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Age (years) *</label>
            <input
              value={profile.age}
              onChange={(e) => update("age", e.target.value)}
              onBlur={() => onBlur("age")}
              placeholder="Age in years"
              style={styleFor("age")}
              inputMode="numeric"
              disabled={isSaving}
            />
            {touched.age && errors.age && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.age}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Height (cm) *</label>
            <input
              value={profile.height}
              onChange={(e) => update("height", e.target.value)}
              onBlur={() => onBlur("height")}
              placeholder="Height in centimeters"
              style={styleFor("height")}
              inputMode="decimal"
              disabled={isSaving}
            />
            {touched.height && errors.height && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.height}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Weight (kg) *</label>
            <input
              value={profile.weight}
              onChange={(e) => update("weight", e.target.value)}
              onBlur={() => onBlur("weight")}
              placeholder="Weight in kilograms"
              style={styleFor("weight")}
              inputMode="decimal"
              disabled={isSaving}
            />
            {touched.weight && errors.weight && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.weight}
              </div>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Blood Type *</label>
            <select
              value={profile.bloodType}
              onChange={(e) => update("bloodType", e.target.value)}
              onBlur={() => onBlur("bloodType")}
              style={{ ...styleFor("bloodType"), padding: 12 }}
              disabled={isSaving}
            >
              <option value="">Select Blood Type</option>
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>Unknown</option>
            </select>
            {touched.bloodType && errors.bloodType && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.bloodType}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Credentials */}
      <div style={sectionBox("rgba(120,200,255,0.6)")}>
        <h2 style={{ margin: "0 0 12px 0", color: "#9be7ff" }}>
          🔐 Account Credentials
        </h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={labelStyle}>User ID *</label>
            <input
              value={profile.userId}
              onChange={(e) => update("userId", e.target.value)}
              onBlur={() => onBlur("userId")}
              placeholder="Choose a unique astronaut ID"
              style={styleFor("userId")}
              disabled={isSaving}
            />
            {touched.userId && errors.userId && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.userId}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Password *</label>
            <input
              type="password"
              value={profile.password}
              onChange={(e) => update("password", e.target.value)}
              onBlur={() => onBlur("password")}
              placeholder="Create a strong password"
              style={styleFor("password")}
              disabled={isSaving}
            />
            {touched.password && errors.password && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.password}
              </div>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Confirm Password *</label>
            <input
              type="password"
              value={profile.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              onBlur={() => onBlur("confirmPassword")}
              placeholder="Re-enter password"
              style={styleFor("confirmPassword")}
              disabled={isSaving}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div style={sectionBox("rgba(255,0,110,0.6)")}>
        <h2 style={{ margin: "0 0 12px 0", color: "#ff66b3" }}>
          🩺 Medical Information
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={labelStyle}>Medical History *</label>
            <textarea
              value={profile.medicalHistory}
              onChange={(e) => update("medicalHistory", e.target.value)}
              onBlur={() => onBlur("medicalHistory")}
              placeholder="Previous medical conditions, surgeries, etc."
              style={{ ...styleFor("medicalHistory"), minHeight: 80 }}
              disabled={isSaving}
            />
            {touched.medicalHistory && errors.medicalHistory && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.medicalHistory}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Allergies *</label>
            <textarea
              value={profile.allergies}
              onChange={(e) => update("allergies", e.target.value)}
              onBlur={() => onBlur("allergies")}
              placeholder="Known allergies (enter 'None' if none)"
              style={{ ...styleFor("allergies"), minHeight: 60 }}
              disabled={isSaving}
            />
            {touched.allergies && errors.allergies && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.allergies}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Current Medications *</label>
            <textarea
              value={profile.medications}
              onChange={(e) => update("medications", e.target.value)}
              onBlur={() => onBlur("medications")}
              placeholder="List current medications with dosages (enter 'None' if none)"
              style={{ ...styleFor("medications"), minHeight: 60 }}
              disabled={isSaving}
            />
            {touched.medications && errors.medications && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.medications}
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Fitness Level *</label>
            <select
              value={profile.fitnessLevel}
              onChange={(e) => update("fitnessLevel", e.target.value)}
              onBlur={() => onBlur("fitnessLevel")}
              style={{ ...styleFor("fitnessLevel"), padding: 12 }}
              disabled={isSaving}
            >
              <option value="">Select Fitness Level</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Average</option>
              <option>Poor</option>
            </select>
            {touched.fitnessLevel && errors.fitnessLevel && (
              <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
                ❌ {errors.fitnessLevel}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mission Information */}
      <div style={sectionBox("rgba(0,255,180,0.35)")}>
        <h2 style={{ margin: "0 0 12px 0", color: "#4fffd8" }}>
          🚀 Mission Information
        </h2>
        <label style={labelStyle}>Previous Space Missions *</label>
        <textarea
          value={profile.previousMissions}
          onChange={(e) => update("previousMissions", e.target.value)}
          onBlur={() => onBlur("previousMissions")}
          placeholder="Details of previous space missions (enter 'None' if none)"
          style={{ ...styleFor("previousMissions"), minHeight: 80 }}
          disabled={isSaving}
        />
        {touched.previousMissions && errors.previousMissions && (
          <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
            ❌ {errors.previousMissions}
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div style={sectionBox("rgba(255,160,60,0.6)")}>
        <h2 style={{ margin: "0 0 12px 0", color: "#ff9a4d" }}>
          📞 Emergency Contact
        </h2>
        <label style={labelStyle}>Emergency Contact Details *</label>
        <textarea
          value={profile.emergencyContact}
          onChange={(e) => update("emergencyContact", e.target.value)}
          onBlur={() => onBlur("emergencyContact")}
          placeholder="Name, phone number, email, relationship"
          style={{ ...styleFor("emergencyContact"), minHeight: 60 }}
          disabled={isSaving}
        />
        {touched.emergencyContact && errors.emergencyContact && (
          <div style={{ color: "#ffb3c1", marginTop: 8, fontSize: 12 }}>
            ❌ {errors.emergencyContact}
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div style={sectionBox("rgba(180,120,255,0.6)")}>
        <h2 style={{ margin: "0 0 12px 0", color: "#d6b3ff" }}>
          📝 Additional Notes
        </h2>
        <label style={labelStyle}>
          Special Notes / Observations (Optional)
        </label>
        <textarea
          value={profile.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Any additional observations (optional)"
          style={{ ...styleFor("notes"), minHeight: 80 }}
          disabled={isSaving}
        />
      </div>

      {/* Buttons */}
      <div style={buttonsRow}>
        <button
          onClick={doSave}
          disabled={isSaving || !isValid}
          style={btnStyle("linear-gradient(90deg,#00FFFF,#B700FF)", isValid)}
          title={isValid ? "Save profile locally" : "Fill your details first"}
        >
          {isSaving ? "💾 Saving..." : "✓ Save Profile"}
        </button>

        <button
          onClick={doExport}
          disabled={isSaving || !isValid}
          style={btnStyle("linear-gradient(90deg,#00ffb3,#00d1ff)", isValid)}
          title={
            isValid
              ? "Export profile with encryption & blockchain"
              : "Fill your details first"
          }
        >
          {isSaving ? "🔒 Encrypting..." : "🔐 Export Encrypted"}
        </button>

        <button
          onClick={doClear}
          disabled={isSaving}
          style={{
            ...btnBase,
            minWidth: 140,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "#ff8b66",
            opacity: isSaving ? 0.6 : 1
          }}
        >
          🧹 Clear All
        </button>

        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={doContinue}
            disabled={isSaving || !isValid}
            style={{
              ...btnStyle("linear-gradient(90deg,#a58bff,#7bdcff)", isValid),
              minWidth: 220
            }}
            title={
              isValid
                ? "Save and continue to health options"
                : "Fill your details first"
            }
          >
            {isSaving
              ? "⏳ Saving & Navigating..."
              : "Save profile & continue →"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <div style={{ color: "#9fb4c9", fontSize: 13 }}>
          {savedAt
            ? `✅ Last saved: ${new Date(savedAt).toLocaleString()}`
            : "❌ Profile not yet saved"}
        </div>
        <div
          style={{ color: "#6b7c8f", fontSize: 12, marginTop: 8 }}
        >
          💡 Tip: Click "Save profile & continue" to encrypt your data and
          proceed to health monitoring.
        </div>
      </div>
    </div>
  );
}
