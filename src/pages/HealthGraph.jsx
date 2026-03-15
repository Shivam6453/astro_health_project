import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HealthGraph() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) {
      setError("Please enter userId and password");
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

      // First login
      const loginRes = await fetch(`${API_URL}/api/astronauts/login-and-decrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password })
      });

      const loginData = await loginRes.json();
      if (!loginData.success) {
        setError(loginData.message);
        return;
      }

      // Then get analysis
      const analysisRes = await fetch(`${API_URL}/api/health/analyze/${userId}`);
      const analysisData = await analysisRes.json();
      if (!analysisData.success) {
        setError(analysisData.message);
        return;
      }

      setAnalysis(analysisData.analysis);
      setLoggedIn(true);
      setError("");
    } catch (err) {
      setError("Server error");
    }
  };

  if (!loggedIn) {
    return (
      <div className="page-layout">
        <section className="card" style={{ maxWidth: "400px", margin: "0 auto" }}>
          <h1>Login to View Health Graph</h1>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
            />
            <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
              Login
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </section>
      </div>
    );
  }

  if (!analysis) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: analysis.timestamps,
    datasets: [
      {
        label: 'Mental Health Rating',
        data: analysis.mental,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Physical Health Rating',
        data: analysis.physical,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Overall Health Rating',
        data: analysis.overall,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Ratings Over Last 5 Entries',
      },
    },
    scales: {
      y: {
        min: 1,
        max: 10,
      },
    },
  };

  return (
    <div className="page-layout">
      <section className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1>Your Health Graph</h1>
        <Line data={data} options={options} />
      </section>
    </div>
  );
}