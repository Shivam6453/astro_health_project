
const express = require("express");
const router = express.Router();
const { askAI } = require("../services/aiService");
const { detectMoodFromImage } = require("../services/moodService");

router.post("/chat", async (req, res) => {
  const { history, mood } = req.body;

  if (!history || history.length === 0) {
    return res.json({ reply: "Hello astronaut! How can I help you today?" });
  }

  const lastMessage = history[history.length - 1].content;

  try {
    const reply = await askAI(lastMessage, mood);
    res.json({ reply });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({
      reply: "AI server error. Make sure Ollama is running."
    });
  }
});

router.post("/mood", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Missing image" });
  }

  try {
    const result = await detectMoodFromImage(image);
    res.json(result);
  } catch (error) {
    console.error("Mood detection error:", error);
    res.status(500).json({ error: "Mood detection failed" });
  }
});

module.exports = router;

