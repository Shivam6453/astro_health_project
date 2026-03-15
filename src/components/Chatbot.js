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
    const msg = {
      id: Date.now(),
      from: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    respond(msg.text);
  }

  function respond(userText) {
    setTyping(true);

    setTimeout(() => {
      const replyText = buildBotReply(userText);
      const reply = {
        id: Date.now() + 1,
        from: "bot",
        text: replyText,
      };
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
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "520px" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#e0f2fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginRight: 10,
          }}
        >
          {BOT_AVATAR}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Wellness Companion</div>
          <div style={{ fontSize: 12, color: "#16a34a" }}>Online • Ready to listen</div>
        </div>
      </header>

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
              border: "1px solid #e5e7eb",
            }}
            onClick={() => handleQuickAction(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>

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

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 8,
          borderTop: "1px solid #e5e7eb",
          paddingTop: 8,
          marginTop: 4,
        }}
      >
        <input
          className="input"
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
            background: "#e0f2fe",
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
          borderRadius: 14,
          fontSize: 14,
          lineHeight: 1.4,
          background: isUser ? "#0ea5e9" : "#f3f4f6",
          color: isUser ? "#f9fafb" : "#111827",
          border: isUser ? "none" : "1px solid #e5e7eb",
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
            background: "#fee2e2",
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
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#e0f2fe",
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
          background: "#f3f4f6",
          border: "1px solid #e5e7eb",
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

// Simple rule-based replies for now
function buildBotReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes("motivation")) {
    return "You are doing incredible work up there. Every reading you send back helps people on Earth learn more and stay safer. Take a deep breath—this mission needs your focus, and you are delivering.";
  }
  if (text.includes("meditation") || text.includes("breathe")) {
    return "Let’s try a quick 4‑4‑4 breathing cycle. Inhale gently through your nose for 4 counts, hold for 4, and exhale slowly for 4. Repeat this for 8 rounds while focusing on the feeling of weightlessness.";
  }
  if (text.includes("exercise")) {
    return "Here’s a light routine for microgravity: 5 minutes of light treadmill work, 3 sets of resistance band rows, 3 sets of squats using the harness, then stretching for shoulders and lower back.";
  }
  if (text.includes("mission")) {
    return "Tell me what part of today’s mission you are most focused on. We can break it into smaller steps so that each segment feels achievable and clear.";
  }
  if (text.includes("tired") || text.includes("exhausted")) {
    return "Feeling tired is natural on extended missions. If possible, reduce screen exposure for a short window, hydrate, and take a brief pause from intensive tasks before continuing.";
  }
  if (text.includes("anxious") || text.includes("worried")) {
    return "Thank you for sharing that. Identify one specific thing worrying you right now, and we’ll focus on that. Narrowing your concern often makes it easier to address.";
  }

  return "Understood. I am here to listen and support you. You can ask for motivation, a short meditation, an exercise routine, or we can talk through any part of your mission that is on your mind.";
}
