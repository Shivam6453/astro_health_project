// src/services/api.js

// Future: yahan se backend HTTP calls jayenge.
// Abhi ke liye dummy async functions jo local/session storage use karte hain.

export async function saveAstronautProfile(profile) {
  sessionStorage.setItem("astronautProfile", JSON.stringify(profile));
  return { ok: true };
}

export async function getAstronautProfile() {
  const raw = sessionStorage.getItem("astronautProfile");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Save Health Vitals to MongoDB
export async function saveHealthVitals(userId, mentalData, physicalData) {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  try {
    const payload = {
      userId,
      timestamp: new Date().toISOString(),
    };

    if (mentalData) {
      payload.mental = {
        stress: mentalData.stress || 0,
        anxiety: mentalData.anxiety || 0,
        isolation: mentalData.isolation || 0,
        focus: mentalData.focus || 0,
        sleep: mentalData.sleep || 0,
        mood: mentalData.mood || 0,
        moodCategory: mentalData.moodCategory || "neutral",
      };
    }

    if (physicalData) {
      payload.physical = {
        heartRate: parseFloat(physicalData.heartRate) || null,
        systolicBP: physicalData.systolicBP || null,
        diastolicBP: physicalData.diastolicBP || null,
        spo2: parseFloat(physicalData.spO2) || null,
        temperature: parseFloat(physicalData.temperature) || null,
        steps: physicalData.steps || null,
      };
    }

    const response = await fetch(`${API_URL}/api/health/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save health data");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Health vitals save error:", error);
    return { success: false, error: error.message };
  }
}

// Example placeholder for vitals
export async function fetchLatestVitals() {
  // In future, backend sensors se data aayega
  return null;
}
