import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ISRO() {
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
            src="/assets/images/isro-logo.png"
            alt="ISRO"
            style={{
              height: 100,
              marginBottom: 16,
              filter: "drop-shadow(0 8px 20px rgba(0, 217, 255, 0.3))",
            }}
          />
          <h1 className="page-title">Indian Space Research Organisation</h1>
          <p className="page-subtitle">ISRO - India's premier space agency</p>
        </div>

        <div className="detail-section">
          <h2>About ISRO</h2>
          <p>
            The Indian Space Research Organisation (ISRO) is India's national
            space agency headquartered in Bangalore. Established in 1969, ISRO
            has become one of the world's leading space agencies, known for
            cost-effective and innovative space technologies.
          </p>
        </div>

        <div className="detail-section">
          <h2>Key Facts</h2>
          <ul>
            <li>
              <strong>Founded:</strong> 1969
            </li>
            <li>
              <strong>Headquarters:</strong> Bangalore, India
            </li>
            <li>
              <strong>Director:</strong> S. Somanath
            </li>
            <li>
              <strong>Notable Achievement:</strong> Chandrayaan-3 lunar landing
              (2023)
            </li>
            <li>
              <strong>Mission Type:</strong> Lunar, Planetary, Earth observation,
              satellite launches
            </li>
          </ul>
        </div>

        <div className="detail-section">
          <h2>Major Missions</h2>
          <ul>
            <li>
              <strong>Chandrayaan Program:</strong> Lunar exploration missions to
              study the Moon's surface and subsurface
            </li>
            <li>
              <strong>Mangalyaan (Mars Orbiter):</strong> India's first
              interplanetary mission to study Mars
            </li>
            <li>
              <strong>Gaganyaan:</strong> India's crewed spaceflight program to
              send astronauts to orbit
            </li>
            <li>
              <strong>Aditya-L1:</strong> Solar mission to study the Sun's
              corona and solar wind
            </li>
            <li>
              <strong>PSLV & GSLV:</strong> Reliable launch vehicles for
              satellite deployment
            </li>
          </ul>
        </div>

        <div className="detail-section">
          <h2>Gaganyaan Program</h2>
          <p>
            The Gaganyaan program aims to send Indian astronauts to low Earth
            orbit by 2025. This mission represents India's commitment to human
            spaceflight and demonstrates the nation's capability to conduct
            independent crewed space missions. astro_friend is designed to
            support Gaganyaan astronauts with comprehensive health monitoring
            and wellness support during their missions.
          </p>
        </div>

        <div className="detail-section">
          <h2>Innovation & Technology</h2>
          <p>
            ISRO is renowned for developing cost-effective space technologies
            and achieving remarkable success rates. The organization continues
            to advance India's capabilities in satellite communication, Earth
            observation, navigation systems (NavIC), and deep space exploration.
          </p>
        </div>
      </div>
    </div>
  );
}
