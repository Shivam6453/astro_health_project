import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AstronautRoute from '../routes/astronaut';

export default function Intro() {
  const navigate = useNavigate();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [modalMode, setModalMode] = useState("upload"); // "upload" or "load"

  useEffect(() => {
    // Removed automatic loading - photos will only load after manual credential entry
  }, []);

  const loadSavedPhotos = async (uid, pwd) => {
    setIsLoadingPhotos(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/photos/getPhotos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, password: pwd })
      });
      const photos = await response.json();
      if (Array.isArray(photos)) {
        setSavedPhotos(photos.map(photo => ({
          id: photo._id,
          src: `${API_URL}/uploads/${photo.image}`,
          title: photo.title,
          emoji: "📷",
        })));
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setIsLoadingPhotos(false);
    }
  };
  

  const handleModalSubmit = async () => {
    if (!userId || !password) {
      alert("User ID and password required");
      return;
    }

    if (modalMode === "upload") {
      await uploadPhotosToBackend();
    } else if (modalMode === "load") {
      await loadPhotosWithCredentials();
    }
  };

  const uploadPhotosToBackend = async () => {
    setIsUploading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      for (const file of pendingFiles) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", userId);
        formData.append("password", password);
        formData.append("title", file.name);

        const response = await fetch(`${API_URL}/api/photos/upload`, {
          method: "POST",
          body: formData
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Upload failed");
        }
      }
      alert("Photos uploaded successfully!");
      localStorage.setItem("photoUserId", userId);
      localStorage.setItem("photoPassword", password);
      setShowModal(false);
      setPendingFiles([]);
      // Reload saved photos
      loadSavedPhotos(userId, password);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const loadPhotosWithCredentials = async () => {
    setIsLoadingPhotos(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/photos/getPhotos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password })
      });
      const photos = await response.json();
      if (Array.isArray(photos)) {
        setSavedPhotos(photos.map(photo => ({
          id: photo._id,
          src: `${API_URL}/uploads/${photo.image}`,
          title: photo.title,
          emoji: "📷",
        })));
        localStorage.setItem("photoUserId", userId);
        localStorage.setItem("photoPassword", password);
        alert("Photos loaded successfully!");
        setShowModal(false);
      } else {
        alert("No photos found for these credentials");
      }
    } catch (error) {
      console.error("Error loading photos:", error);
      alert(`Failed to load photos: ${error.message}`);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  function handlePhotoUpload(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPendingFiles(Array.from(files));
      setModalMode("upload");
      setShowModal(true);
    }
  }

  function handleLoadPhotos() {
    setModalMode("load");
    setPendingFiles([]);
    setShowModal(true);
  }

  const galleryItems = [
    { fileName: "blackhole.jpg", title: "Black Hole" },
    { fileName: "space-station.jpg", title: "Space Station" },
    { fileName: "solar-system.jpg", title: "Solar System" },
    { fileName: "nebula.jpg", title: "Nebula" },
    { fileName: "mars.jpg", title: "Mars" },
    { fileName: "earth.jpg", title: "Earth" },
    { fileName: "milky-way.jpg", title: "Milky Way Galaxy" },
    { fileName: "space-shuttle.jpg", title: "Space Shuttle" },
    { fileName: "astronaut.jpg", title: "Astronaut" },
    { fileName: "universe.jpg", title: "Universe" },
  ];

  return (
    <div className="page-layout">
      {/* HERO */}
      <section className="card hero-wrapper">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            astro_friend • Astronaut Health Platform
          </div>
          <h1 className="hero-heading">
            Safer missions for <span className="hero-highlight">ISRO, NASA</span> and beyond.
          </h1>
          <p className="hero-text">
            A unified system to monitor astronaut vitals, support mental wellness and keep encrypted medical records ready for ground doctors during long‑duration spaceflight.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate("/details")}>
              Start astronaut onboarding →
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/health-graph")}>
              View Health Graph
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => document.getElementById("home-details")?.scrollIntoView({ behavior: "smooth" })}
            >
              View system overview
            </button>
          </div>

          <div className="hero-meta-row">
            <span className="hero-meta-pill">24/7 vitals monitoring</span>
            <span className="hero-meta-pill">AI wellness companion</span>
            <span className="hero-meta-pill">Blockchain‑ready records</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-main">
            <img
              src="/assets/images/hero-dashboard.jpg"
              alt="Mission dashboard"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '2px solid #00FFFF',
                display: 'block'
              }}
            />
             <div className="hero-image-tag">Mission control view • Sample dashboard</div>
           </div>
         </div>
      </section>

      {/* INFO SECTIONS */}
      <section id="home-details" className="home-sections">
        <div className="card">
          <h2 className="home-section-title">Built for space agencies</h2>
          <p className="home-section-text">
            Astro_Friend is envisioned as a reference solution that can be customised by organisations like ISRO, NASA and international partners for their own crewed missions.
          </p>
          <ul className="home-section-list">
            <li>Works alongside existing mission control software.</li>
            <li>Supports multiple spacecraft and mission profiles.</li>
            <li>Clear separation of astronaut and ground views.</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="home-section-title">Complete health coverage</h2>
          <p className="home-section-text">
            Physical vitals, activity monitoring and mental‑health assessments are brought together in one secure interface.
          </p>
          <ul className="home-section-list">
            <li>Continuous vitals from sensors and wearables.</li>
            <li>Mental‑health check‑ins with trend tracking.</li>
            <li>Encrypted medical history for mission doctors.</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="home-section-title">Designed for isolation</h2>
          <p className="home-section-text">
            Astronauts face disrupted day‑night cycles and extreme isolation. The system emphasises support without adding stress.
          </p>
          <ul className="home-section-list">
            <li>Positive, mission‑oriented conversational tone.</li>
            <li>Adaptive alerts based on workload and stress.</li>
            <li>Private, judgement‑free space for reflection.</li>
          </ul>
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section className="card gallery-section">
        <div>
          <h2 className="home-section-title">Mission gallery</h2>
        </div>

        {/* Required Filenames */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(183, 0, 255, 0.1))',
          border: '2px solid #00FFFF',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <p style={{ color: 'var(--neon-cyan)', fontWeight: '700', marginBottom: '1rem' }}>The Images of Black Hole, Space Station, Solar System, Nebula, Mars, Earth</p>
        </div>

        {/* Gallery Grid - Real Images */}
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div key={item.fileName}>
              <ImageCard fileName={item.fileName} title={item.title} />
              <button
                className={`chip ${activeTab === item.title ? 'active' : ''}`}
                onClick={() => setActiveTab(activeTab === item.title ? null : item.title)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  marginTop: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  border: '2px solid',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  background: activeTab === item.title 
                    ? 'linear-gradient(135deg, #00FFFF, #B700FF)' 
                    : 'linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(183, 0, 255, 0.15))',
                  borderColor: activeTab === item.title ? '#00FFFF' : '#B700FF',
                  color: activeTab === item.title ? '#000000' : '#00FFFF',
                  boxShadow: activeTab === item.title
                    ? '0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(183, 0, 255, 0.4)'
                    : '0 0 10px rgba(183, 0, 255, 0.3)',
                  textShadow: activeTab === item.title ? 'none' : '0 0 5px rgba(0, 255, 255, 0.3)'
                }}
              >
                {item.title}
              </button>
            </div>
          ))}
        </div>

        {/* Saved Photos */}
        {savedPhotos.length > 0 ? (
          <div
            style={{
              marginTop: "3rem",
              padding: "2rem",
              background:
                "linear-gradient(135deg, rgba(255,0,110,0.1), rgba(183,0,255,0.1))",
              border: "2px solid #FF006E",
              borderRadius: "10px",
            }}
          >
            <h3 style={{ color: "var(--neon-pink)", marginBottom: "1rem" }}>
              📸 Your Saved Photos ({savedPhotos.length})
            </h3>

            <div className="gallery-grid">
              {savedPhotos.map((photo, index) => (
                <div key={photo.id || index} className="gallery-card">
                  <div className="gallery-card-image">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      padding: "6px",
                    }}
                  >
                    {photo.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: "3rem",
              padding: "2rem",
              background: "rgba(255,255,255,0.05)",
              border: "2px dashed rgba(255,0,110,0.3)",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "var(--neon-pink)", marginBottom: "1rem" }}>
              📸 No Photos Loaded Yet
            </h3>
            <p style={{ color: "var(--text-color)", marginBottom: "1rem" }}>
              Click "Load My Photos" to view your saved photos with your credentials.
            </p>
            <button
              onClick={handleLoadPhotos}
              style={{
                background: "linear-gradient(135deg, #FF006E, #B700FF)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Load My Photos
            </button>
          </div>
        )}

        {/* Upload Box */}
        <div style={{ marginTop: '2rem' }}>
          <label htmlFor="photo-upload" className="upload-box">
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Upload more photos</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Click to select or drag & drop</div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handlePhotoUpload(e)}
            />
          </label>
        </div>
      </section>

      {/* AGENCY BUTTONS SECTION */}
      <section className="card agency-buttons-section">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 className="home-section-title">Learn More About Our Partners</h2>
        </div>
        <div className="agency-buttons-grid">
          <button className="btn btn-primary agency-btn" onClick={() => navigate("/isro")}>
            <img src="\assets\images\isro-logo.png" alt="ISRO" style={{ width: 48, height: 48, display: 'block', marginBottom: 8, objectFit: 'contain' }} />
            ISRO Details →
          </button>
          <button className="btn btn-primary agency-btn" onClick={() => navigate("/nasa")}>
             <img src="\assets\images\nasa-logo.png" alt="NASA" style={{ width: 48, height: 48, display: 'block', marginBottom: 8, objectFit: 'contain' }} />
             NASA Details →
           </button>
         </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="card contact-card">
        <div>
          <h2 className="home-section-title">Contact for collaboration</h2>
          <p className="home-section-text">
            astro_friend is a personal prototype designed for astronaut health support research and hackathons. For discussions, feedback, or collaboration ideas, reach out to the creator.
          </p>
        </div>
        <div className="contact-grid">
          <div>
            <div className="form-label">Name</div>
            <div className="contact-value">Shivam Kaundal</div>
          </div>
          <div>
            <div className="form-label">Email / ID</div>
            <div className="contact-value">24bph030@nith.ac.in</div>
            <div className="form-hint">Use this ID when contacting through institute or project channels.</div>
          </div>
          <div>
            <div className="form-label">Phone</div>
            <div className="contact-value">9317956414</div>
            <div className="form-hint">Available for calls or messages for project discussions.</div>
          </div>
        </div>
      </section>

      {/* NATIONAL EMBLEM SECTION */}
      <section className="card emblem-section">
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 100,
            height: 100,
            margin: '0 auto 16px',
            border: '2px solid #FFFF00',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)'
          }}>
            <img 
  src="/assets/images/india-emblem.png" 
  alt="India" 
  style={{ width: '70%', height: '70%', objectFit: 'contain' }} 
/>

          </div>
          <h2 className="home-section-title">Made in India 🇮🇳</h2>
          <p className="home-section-text" style={{ marginBottom: 0, maxWidth: 600, margin: "0 auto" }}>
            astro_friend is proudly developed as an Indian innovation for global space exploration. This prototype demonstrates India's commitment to advancing astronaut health and wellness technologies for the Gaganyaan program and international space missions.
            It is made by Team Shift + Delete the passionate developers dedicated to pushing the boundaries of space health solutions.
          </p>
        </div>
      </section>

      {/* Modal for Photo Upload Credentials */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1f3c5d, #02030a)",
              border: "2px solid #00FFFF",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
              color: "#e6eef8",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#9be7ff", marginBottom: "1rem", textAlign: "center" }}>
              📷 {modalMode === "upload" ? "Save Photos Securely" : "Load Your Photos"}
            </h3>
            <p style={{ color: "#9fb4c9", marginBottom: "1.5rem", textAlign: "center" }}>
              {modalMode === "upload" 
                ? `Enter your User ID and password to save ${pendingFiles.length} photo(s) to your account.`
                : "Enter your User ID and password to load your saved photos."
              }
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#9be7ff" }}>
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. 24BPH030"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,255,255,0.3)",
                  background: "rgba(15,30,50,0.9)",
                  color: "#e6eef8",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#9be7ff" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secret password"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,255,255,0.3)",
                  background: "rgba(15,30,50,0.9)",
                  color: "#e6eef8",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #9fb4c9",
                  background: "transparent",
                  color: "#9fb4c9",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={(modalMode === "upload" && isUploading) || (modalMode === "load" && isLoadingPhotos) || !userId || !password}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background: (modalMode === "upload" && isUploading) || (modalMode === "load" && isLoadingPhotos) ? "#666" : "linear-gradient(135deg, #00FFFF, #B700FF)",
                  color: "#000",
                  cursor: (modalMode === "upload" && isUploading) || (modalMode === "load" && isLoadingPhotos) ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {modalMode === "upload" 
                  ? (isUploading ? "Uploading..." : "Save Photos")
                  : (isLoadingPhotos ? "Loading..." : "Load Photos")
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageCard({ fileName, title }) {
  const srcPath = `/assets/images/${fileName}`;
  const debugSrc = `${srcPath}?v=${Date.now()}`; 
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("checking");

  React.useEffect(() => {
    let mounted = true;
    // Try a HEAD request to detect 404 quickly
    fetch(srcPath, { method: "HEAD" })
      .then((res) => {
        if (!mounted) return;
        if (res.ok) {
          setStatus("OK");
          setError(null);
        } else {
          setStatus(`HTTP ${res.status}`);
          setError(`Not found (${res.status})`);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setStatus("fetch-error");
        setError(err.message);
      });
    return () => (mounted = false);
  }, [fileName]);

  return (
    <div className="gallery-card">
      <div className="gallery-card-image" style={{ position: "relative" }}>
        <img
          src={debugSrc}
          alt={title || fileName}
          onLoad={() => setLoaded(true)}
          onError={() => setError("load-failed")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded && !error ? 1 : 0,
            transition: "opacity 0.25s",
          }}
        />

        {/* overlay while loading or on error */}
        {!loaded && !error && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.45)", color: "#ddd", fontSize: "0.9rem"
          }}>
            ⏳ Loading...
          </div>
        )}

        {error && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(40,0,60,0.6))",
            color: "#ffcccc", fontSize: "0.9rem", padding: 8, textAlign: "center"
          }}>
            <div style={{ fontWeight: 700 }}>⚠️ Image missing</div>
            <div style={{ fontSize: "0.85rem", marginTop: 6 }}>{fileName}</div>
            <div style={{ fontSize: "0.75rem", marginTop: 6, color: "#ffd" }}>{status}</div>
            <div style={{ fontSize: "0.75rem", marginTop: 6 }}>{srcPath}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryCard({ title, emoji }) {
  return (
    <div className="gallery-card">
      <div className="gallery-card-image">
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem",
          background: "linear-gradient(135deg, rgba(0,217,255,0.1), rgba(183,0,255,0.1))",
        }}>
          {emoji}
        </div>
      </div>
      <div className="gallery-card-title">{title}</div>
    </div>
  );
}
