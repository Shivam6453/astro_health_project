import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NASA() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout">
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/")}
        style={{ marginBottom: 20 }}
      >
        ← Back to home
      </button>

      <div className="card agency-detail">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src="/assets/images/nasa-logo.png"
            alt="NASA"
            style={{
              height: 100,
              marginBottom: 16,
              filter: "drop-shadow(0 8px 20px rgba(0, 217, 255, 0.3))",
            }}
          />
          <h1 className="page-title">National Aeronautics and Space Administration</h1>
          <p className="page-subtitle">NASA - United States' space agency</p>
        </div>

        <div className="detail-section">
          <h2>About NASA</h2>
          <p>
            The National Aeronautics and Space Administration (NASA) is the
            United States' independent agency responsible for the civilian space
            program. Established in 1958, NASA has led humanity's exploration of
            space with landmark achievements in human spaceflight, robotic
            exploration, and Earth science.
          </p>
        </div>

        <div className="detail-section">
          <h2>Key Facts</h2>
          <ul>
            <li>
              <strong>Founded:</strong> 1958
            </li>
            <li>
              <strong>Headquarters:</strong> Washington D.C., United States
            </li>
            <li>
              <strong>Administrator:</strong> Bill Nelson
            </li>
            <li>
              <strong>Notable Achievement:</strong> Apollo 11 Moon landing (1969)
            </li>
            <li>
              <strong>Mission Type:</strong> Human spaceflight, Mars exploration,
              Earth monitoring, astrophysics
            </li>
          </ul>
        </div>

        <div className="detail-section">
          <h2>Major Missions & Programs</h2>
          <ul>
            <li>
              <strong>Apollo Program:</strong> Historic crewed missions to the
              Moon (1961-1972)
            </li>
            <li>
              <strong>Space Shuttle:</strong> Reusable spacecraft program
              (1981-2011)
            </li>
            <li>
              <strong>International Space Station (ISS):</strong> Continuous
              human presence in low Earth orbit since 1998
            </li>
            <li>
              <strong>Mars Rovers:</strong> Curiosity and Perseverance rovers
              exploring Martian geology
            </li>
            <li>
              <strong>Artemis Program:</strong> Next phase of lunar exploration
              with crewed missions
            </li>
            <li>
              <strong>James Webb Space Telescope:</strong> Advanced observatory
              studying distant galaxies and stellar formation
            </li>
          </ul>
        </div>

        <div className="detail-section">
          <h2>Human Spaceflight</h2>
          <p>
            NASA operates the Space Shuttle program successor, commercial crew
            vehicles, and continues to lead human spaceflight operations on the
            ISS. The Artemis program aims to return humans to the Moon and
            eventually enable crewed Mars missions. astro_friend aligns with
            NASA's commitment to ensuring astronaut health and well-being during
            long-duration spaceflight missions.
          </p>
        </div>

        <div className="detail-section">
          <h2>Science & Exploration</h2>
          <p>
            Beyond human spaceflight, NASA operates the most advanced space
            telescopes, robotic rovers, and research satellites. The agency
            continues to advance our understanding of the universe, search for
            life beyond Earth, and develop technologies for sustainable space
            exploration.
          </p>
        </div>
      </div>
    </div>
  );
}
