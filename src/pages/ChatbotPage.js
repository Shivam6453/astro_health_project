import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { detectMood, sendCompanionMessage } from "../api/companionApi";

export default function ChatbotPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // messages: UI ke liye
  const [messages, setMessages] = useState([
    { type: "bot", text: "Namaste! 🙏 I'm Astro_Friend. How are you feeling today?" }
  ]);
  // history: LLM ke liye (role/content)
  const [history, setHistory] = useState([
    {
      role: "assistant",
      content: "Namaste! 🙏 I'm Astro_Friend. How are you feeling today?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [detectedMood, setDetectedMood] = useState("neutral");
  const [moodConfidence, setMoodConfidence] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const msgEnd = useRef(null);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const streamRef = useRef(null);
  const moodIntervalRef = useRef(null);

  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Camera setup & periodic mood sampling
  useEffect(() => {
    let loadedHandler;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          loadedHandler = () => {
            setVideoReady(true);
          };
          videoRef.current.addEventListener("loadedmetadata", loadedHandler);
          
          videoRef.current.addEventListener("error", () => {
            console.error("Video element error");
            setCameraOn(false);
            setVideoReady(false);
          });
        }

        if (moodIntervalRef.current) {
          clearInterval(moodIntervalRef.current);
        }
        moodIntervalRef.current = setInterval(() => {
          if (videoReady) {
            detectAndSetMood().catch(() => {});
          }
        }, 5000);
      } catch (err) {
        console.log("Camera access denied", err);
        setCameraOn(false);
        setDetectedMood("neutral");
        alert("Camera access denied. Mood detection will not work. This is optional - you can still chat!");
      }
    };

    if (cameraOn) {
      setVideoReady(false);
      startCamera();
    } else {
      setVideoReady(false);
      if (moodIntervalRef.current) {
        clearInterval(moodIntervalRef.current);
        moodIntervalRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (loadedHandler && videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", loadedHandler);
      }

      if (moodIntervalRef.current) {
        clearInterval(moodIntervalRef.current);
        moodIntervalRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraOn]);

  // Speech-to-text
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        listeningRef.current = true;
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        listeningRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput((prev) => prev + transcript + " ");
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.log("Speech recognition error:", event.error);
        listeningRef.current = false;
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current && listeningRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch (e) {
          console.log("Error stopping recognition");
        }
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listeningRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log("Error starting recognition:", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Error stopping recognition:", e);
      }
    }
  };

  function captureFrame() {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.7);
  }

  async function detectAndSetMood() {
    const img = captureFrame();
    if (!img) return null;

    try {
      const res = await detectMood(img);
      console.log("Mood detection response:", res);  // Debug log
      if (!res?.label) return null;

      const label = res.label;
      const confidence = res.confidence ?? 0;
      const MIN_CONF = 0.20;  // Match backend
      
      if (confidence < MIN_CONF) {
        console.log("Low confidence, skipping update:", confidence);  // Debug log
        return null;  // Don't update state if low confidence
      }

      setMoodHistory(prev => {
        const nextHistory = [...prev, label].slice(-5);
        const counts = nextHistory.reduce((acc, item) => {
          acc[item] = (acc[item] || 0) + 1;
          return acc;
        }, {});
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const best = sorted[0]?.[0] || "neutral";
        const finalMood = best === "neutral" && sorted.length > 1 ? sorted[1][0] : best;
        
        setDetectedMood(finalMood);
        setMoodConfidence(confidence);
        
        return nextHistory;
      });
      
      return label;
    } catch (err) {
      console.warn("Mood detection failed:", err);
      return null;
    }
  }

  // MAIN: send to OpenAI backend
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { type: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const newHistory = [...history, { role: "user", content: text }];

    try {
      const detected = await detectAndSetMood();
      const moodToSend = detected;
      const reply = await sendCompanionMessage(newHistory, moodToSend);

      const botMsg = { type: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
      setHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Companion error:", err);
      const botMsg = {
        type: "bot",
        text: "yrr thoda technical glitch aa gaya, thodi der baad fir se try karna."
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraToggle = () => {
    if (listeningRef.current) {
      stopListening();
    }
    setCameraOn(!cameraOn);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0f0620 100%)",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        fontFamily: "Segoe UI"
      }}
    >
      {/* Header with Circular Camera */}
      <div
        style={{
          borderBottom: "1px solid rgba(0,255,255,0.1)",
          padding: "1.5rem",
          textAlign: "center",
          background: "rgba(10,10,26,0.8)"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          {/* Circular Camera Feed */}
          <div style={{ position: "relative", width: "120px", height: "120px" }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #00FFFF",
                boxShadow:
                  "0 0 30px rgba(0,255,255,0.5), inset 0 0 20px rgba(0,255,255,0.2)",
                background: "rgba(0,0,0,0.8)"
              }}
            >
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scaleX(-1)"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    background: "rgba(0,0,0,0.5)"
                  }}
                >
                  📹
                </div>
              )}
            </div>

            {/* Camera Toggle Button */}
            <button
              onClick={handleCameraToggle}
              style={{
                position: "absolute",
                bottom: "-10px",
                right: "-10px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: cameraOn
                  ? "linear-gradient(135deg, #00FF41, #00C800)"
                  : "linear-gradient(135deg, #FF6B6B, #FF1744)",
                border: "3px solid rgba(10,10,26,0.8)",
                color: "#fff",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "700",
                boxShadow: "0 0 15px rgba(0,255,255,0.5)",
                transition: "all 0.3s ease"
              }}
              title={cameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {cameraOn ? "✓" : "✕"}
            </button>
          </div>

          <div>
            <h1
              style={{
                margin: "0 0 0.3rem 0",
                fontSize: "1.8rem",
                fontWeight: "700"
              }}
            >
              🤖 Astro_Friend
            </h1>
            <p
              style={{
                margin: "0",
                fontSize: "0.85rem",
                color: "#00FFFF"
              }}
            >
              Your Wellness Companion
            </p>
            <p
              style={{
                margin: "0.4rem 0 0 0",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.7)"
              }}
            >
              Detected mood: <strong>{detectedMood}</strong>
              {moodConfidence != null ? ` (${(moodConfidence * 100).toFixed(0)}%)` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%"
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.type === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "1rem 1.5rem",
                borderRadius:
                  msg.type === "user"
                    ? "18px 18px 0 18px"
                    : "18px 18px 18px 0",
                background:
                  msg.type === "user"
                    ? "linear-gradient(135deg, #00FFFF, #0099FF)"
                    : "rgba(255,255,255,0.08)",
                color: msg.type === "user" ? "#000" : "#e0e0e0",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                boxShadow:
                  msg.type === "user"
                    ? "0 4px 15px rgba(0,255,255,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.3)"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {[0, 0.2, 0.4].map((d) => (
              <div
                key={d}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#00FFFF",
                  animation: "pulse 1.4s infinite",
                  animationDelay: `${d}s`
                }}
              />
            ))}
          </div>
        )}
        <div ref={msgEnd} />
      </div>

      {/* Input Section with Mic */}
      <div
        style={{
          borderTop: "1px solid rgba(0,255,255,0.1)",
          padding: "1.5rem",
          background: "rgba(10,10,26,0.9)",
          display: "flex",
          gap: "0.8rem",
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%"
        }}
      >
        <input
          type="text"
          placeholder="Share your thoughts or use mic..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            padding: "1rem 1.5rem",
            borderRadius: "25px",
            border: "2px solid rgba(0,255,255,0.3)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontSize: "0.95rem",
            outline: "none"
          }}
        />

        {/* Mic Button */}
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onMouseLeave={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          style={{
            padding: "0.8rem 1.2rem",
            background: isListening
              ? "linear-gradient(135deg, #FF6B6B, #FF1744)"
              : "linear-gradient(135deg, #B700FF, #7000FF)",
            border: "none",
            borderRadius: "25px",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: isListening
              ? "0 0 20px rgba(255,23,68,0.6)"
              : "0 4px 15px rgba(183,0,255,0.3)",
            transition: "all 0.3s ease"
          }}
          title="Hold to record"
        >
          🎤
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          style={{
            padding: "0.8rem 1.5rem",
            background: "linear-gradient(135deg, #00FFFF, #0099FF)",
            border: "none",
            borderRadius: "25px",
            color: "#000",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,255,255,0.3)"
          }}
        >
          Send ✨
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid rgba(0,255,255,0.1)",
          padding: "1rem 1.5rem",
          background: "rgba(10,10,26,0.8)",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.7rem 1.5rem",
            background: "rgba(102,126,234,0.2)",
            border: "1px solid rgba(102,126,234,0.5)",
            borderRadius: "20px",
            color: "#a8b3ff",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          🏠 Home
        </button>
        <button
          onClick={() => navigate("/mental-health")}
          style={{
            padding: "0.7rem 1.5rem",
            background: "rgba(255,215,0,0.2)",
            border: "1px solid rgba(255,215,0,0.5)",
            borderRadius: "20px",
            color: "#ffd700",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          🧠 Assessment
        </button>
        <button
          onClick={() => navigate("/physical-health")}
          style={{
            padding: "0.7rem 1.5rem",
            background: "rgba(255,153,0,0.2)",
            border: "1px solid rgba(255,153,0,0.5)",
            borderRadius: "20px",
            color: "#ff9500",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          💪 Physical
        </button>
      </div>

      <style>{`@keyframes pulse { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } }`}</style>
    </div>
  );
}
