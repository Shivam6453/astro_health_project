const encouragement = [
  "You are doing great. Keep going 🚀",
  "I believe in you. Don't stop now.",
  "Every small step matters.",
  "You are stronger than you think."
];

const greetings = [
  "Hey buddy! How are you doing today?",
  "Hello! I'm here with you.",
  "Hi! What's on your mind?"
];

const sadReplies = [
  "I'm here for you. Want to talk about it?",
  "Sometimes things feel heavy, but you're not alone.",
  "Take a deep breath. I'm listening."
];

function detectEmotion(text) {

  text = text.toLowerCase();

  if(text.includes("sad") || text.includes("tired") || text.includes("depressed"))
    return "sad";

  if(text.includes("hi") || text.includes("hello"))
    return "greet";

  if(text.includes("motivate") || text.includes("encourage"))
    return "motivate";

  return "normal";
}

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function generateReply(message){

  const emotion = detectEmotion(message);

  if(emotion === "sad")
    return random(sadReplies);

  if(emotion === "greet")
    return random(greetings);

  if(emotion === "motivate")
    return random(encouragement);

  return "That's interesting. Tell me more about it.";
}

module.exports = { generateReply };