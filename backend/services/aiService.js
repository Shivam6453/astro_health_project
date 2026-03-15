
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function getMoodInstruction(mood = "neutral") {
  const moodLower = (mood || "").toString().toLowerCase();

  if (["sad", "depressed", "tired", "miserable", "disgust"].includes(moodLower)) {
    return "The user seems sad or down. Respond with empathy, encouragement, and a gentle, supportive tone.";
  }

  if (["anxious", "fear", "scared", "worried"].includes(moodLower)) {
    return "The user seems anxious. Respond calmly, reassure them, and offer breathing or grounding suggestions.";
  }

  if (["angry", "frustrated", "annoyed"].includes(moodLower)) {
    return "The user seems angry or frustrated. Acknowledge their feelings, stay calm, and offer constructive next steps.";
  }

  if (["happy", "joyful", "excited"].includes(moodLower)) {
    return "The user seems happy or excited. Keep the energy positive and celebrate their good mood.";
  }

  if (moodLower === "surprise") {
    return "The user seems surprised. Keep the tone upbeat and curious, and encourage them to share more about what surprised them.";
  }

  // default (neutral)
  return "The user seems neutral. Keep a friendly, supportive conversational tone.";
}

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || "models/text-bison-001:generate";

async function askAI(message, mood) {
  const moodPrompt = getMoodInstruction(mood);
  const prompt = `${moodPrompt}\n\nUser: ${message}\nAssistant:`;

  // Prefer Gemini if an API key is provided, otherwise fallback to local Ollama.
  if (GEMINI_API_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1beta2/${GEMINI_MODEL}?key=${encodeURIComponent(
      GEMINI_API_KEY
    )}`;

    const body = {
      prompt: {
        text: prompt
      },
      temperature: 0.4,
      candidate_count: 1
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    const candidate = data?.candidates?.[0]?.content;
    if (candidate) return candidate;

    throw new Error(`Gemini response missing content: ${JSON.stringify(data)}`);
  }

  // Fallback: Ollama local LLM
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
    }),
  });

  const data = await res.json();
  return data.response;
}

module.exports = { askAI };


