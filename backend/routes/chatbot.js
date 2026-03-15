
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { message } = req.body;

  let reply = "Tell me more.";

  if (message.toLowerCase().includes("hello"))
    reply = "Hello buddy!";

  if (message.toLowerCase().includes("sad"))
    reply = "Don't worry. I'm here with you.";

  res.json({
    reply: reply
  });
});

module.exports = router;
