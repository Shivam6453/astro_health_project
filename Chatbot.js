import React, { useEffect, useRef, useState } from "react";

const BOT_AVATAR = "🧑‍⚕️";
const USER_AVATAR = "🧑‍🚀";

const QUICK_ACTIONS = [
  { label: "I need motivation 💪", key: "motivation" },
  { label: "Meditation guide 🧘", key: "meditation" },
  { label: "Exercise routine 🏃", key: "exercise" },
  { label: "Talk about mission 🚀", key: "mission" },
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text:
        "Namaste, I am your Space Wellness Companion. How can I support you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function addUserMessage(text) {
    if (!text.trim()) return;
    const msg = { id: Date.now(), from: "user", text: text.trim() };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    respond(msg.text);
  }

  function respond(userText) {
    setTyping(true);
    setTimeout(() => {
      const replyText = buildBotReply(userText);
      const reply = { id: Date.now() + 1, from: "bot", text: replyText };
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 800);
  }

  function handleSubmit(e) {
    e.preventDefault();
    addUserMessage(input);
  }

  function handleQuickAction(key) {
    let text = "";
    switch (key) {
      case "motivation":
        text = "I need some motivation.";
        break;
      case "meditation":
        text = "Guide me through a short meditation.";
        break;
      case "exercise":
        text = "Suggest a light exercise routine.";
        break;
      case "mission":
        text = "Let's talk about my mission today.";
        break;
      default:
        text = "Hello.";
    }
    addUserMessage(text);
  }

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "520px",
        background:
          "radial-gradient(circle at top, #111827 0, #020617 55%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
          paddingBottom: 8,
          borderBottom: "1px solid #1f2937",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 0%, #38bdf8 0, #1d4ed8 55%, #020617 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginRight: 10,
            boxShadow: "0 10px 26px rgba(15,23,42,0.85)",
          }}
        >
          {BOT_AVATAR}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#e5e7eb" }}>
            Wellness Companion
          </div>
          <div style={{ fontSize: 12, color: "#22c55e" }}>
            Online • Listening actively
          </div>
        </div>
      </header>

      {/* Quick actions */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.key}
            type="button"
            className="btn btn-ghost"
            style={{
              padding: "6px 12px",
              fontSize: 12,
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.7)",
              background: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
            }}
            onClick={() => handleQuickAction(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "6px 2px",
          marginBottom: 10,
        }}
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} from={m.from} text={m.text} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 8,
          borderTop: "1px solid #1f2937",
          paddingTop: 8,
          marginTop: 4,
        }}
      >
        <input
          className="input"
          style={{ background: "#020617", color: "#e5e7eb" }}
          placeholder="Share how you’re feeling or what you need..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ from, text }) {
  const isUser = from === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            marginRight: 6,
          }}
        >
          {BOT_AVATAR}
        </div>
      )}
      <div
        style={{
          maxWidth: "70%",
          padding: "8px 12px",
          borderRadius: 16,
          fontSize: 14,
          lineHeight: 1.4,
          background: isUser ? "#38bdf8" : "#111827",
          color: isUser ? "#f9fafb" : "#e5e7eb",
          border: isUser ? "none" : "1px solid #1f2937",
          boxShadow: isUser
            ? "0 6px 20px rgba(56,189,248,0.4)"
            : "0 4px 14px rgba(15,23,42,0.8)",
        }}
      >
        {text}
      </div>
      {isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            marginLeft: 6,
          }}
        >
          {USER_AVATAR}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
        marginLeft: 4,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        {BOT_AVATAR}
      </div>
      <div
        style={{
          padding: "6px 10px",
          borderRadius: 999,
          background: "#111827",
          border: "1px solid #1f2937",
          display: "flex",
          gap: 4,
        }}
      >
        <Dot />
        <Dot />
        <Dot />
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#9ca3af",
        display: "inline-block",
        animation: "chat-dot 1s infinite ease-in-out",
      }}
    />
  );
}
// Simple rule-based replies
function buildBotReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes("motivation")) {
    return "You are doing exceptional work in a very demanding environment. Every stable reading and completed task brings your mission, and everyone back home, one step closer to success.";
  }
  if (text.includes("meditation") || text.includes("breathe")) {
    return "Let’s try a short breathing exercise. Inhale slowly for 4 counts, hold for 4, and exhale for 4. Repeat for 8 cycles while noticing how your body feels in microgravity.";
  }
  if (text.includes("exercise")) {
    return "Suggested light routine: 5 minutes cycle‑ergometer warm‑up, 3 sets of resistance band rows, 3 sets of squats with harness, then gentle stretching for shoulders and lower back.";
  }
  if (text.includes("mission")) {
    return "Tell me which part of today’s mission feels most important or demanding. We can break it into smaller steps and plan short recovery breaks between them.";
  }
  if (text.includes("tired") || text.includes("exhausted")) {
    return "Feeling tired in this environment is completely valid. If your schedule allows, take a short pause, hydrate, and reduce screen exposure for a few minutes before returning to high‑focus tasks.";
  }
  if (text.includes("anxious") || text.includes("worried")) {
    return "Thank you for sharing that. Try to focus on what you can control right now. Grounding techniques, like feeling contact points with the spacecraft and naming three things you can see, can help bring a sense of calm.";
  }

  // default response
  return "I hear you. I am here to listen and support you. You can ask for motivation, a short breathing or meditation routine, exercise ideas, or we can talk through any part of your mission that is on your mind.";
}
