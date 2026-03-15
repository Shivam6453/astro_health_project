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
