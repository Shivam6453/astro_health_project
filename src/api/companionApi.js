import axios from "axios";

const API_BASE = "http://localhost:5000";

export async function detectMood(imageBase64) {
  const res = await axios.post(`${API_BASE}/api/companion/mood`, {
    image: imageBase64
  });
  return res.data;
}

export async function sendCompanionMessage(history, mood) {
  const res = await axios.post(`${API_BASE}/api/companion/chat`, {
    history,
    mood
  });

  return res.data.reply;
}