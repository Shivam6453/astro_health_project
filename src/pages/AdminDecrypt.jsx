// Example: frontend/src/pages/AdminDecrypt.jsx

import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminDecrypt() {
  const [astronautId, setAstronautId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleMigrate = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/api/migrate/astronaut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astronautId, adminPassword })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(
          `✅ Migrated! Decrypted document ID: ${data.decryptedId}`
        );
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Decrypt & Migrate</h2>
      <input
        placeholder="Astronaut ID"
        value={astronautId}
        onChange={(e) => setAstronautId(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: 400 }}
      />
      <input
        placeholder="Admin password"
        type="password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        style={{ display: "block", marginBottom: 8, width: 400 }}
      />
      <button onClick={handleMigrate}>Decrypt & copy to new DB</button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
