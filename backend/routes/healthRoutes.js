const express = require("express");
const HealthLog = require("../models/HealthLog");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

router.get("/analyze/:userId", async (req, res) => {
  try {

    const { userId } = req.params;

    const logs = await HealthLog.find({ userId }).sort({ timestamp: 1 });

    console.log("UserID:", userId);
    console.log("Logs found:", logs.length);
    console.log("Logs data:", logs);

    if (logs.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Need at least 5 health entries"
      });
    }

    const python = spawn("python", [
      path.join(__dirname, "../../ml_model.py")
    ]);

    let result = "";
    let error = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {

      if (code !== 0) {
        console.error("Python error:", error);
        return res.status(500).json({
          success: false,
          message: "Python script failed",
          error
        });
      }

      try {

        const parsed = JSON.parse(result);

        if (parsed.error) {
          return res.status(500).json({
            success: false,
            message: parsed.error
          });
        }

        res.json({
          success: true,
          analysis: parsed
        });

      } catch (err) {

        res.status(500).json({
          success: false,
          message: "JSON parse error",
          error: err.message
        });

      }

    });

    // 🔥 SEND DATA TO PYTHON
    const cleanLogs = logs.map(log => ({
      mental: log.mental || {},
      physical: log.physical || {},
      timestamp: log.timestamp ? log.timestamp.toISOString() : ''
    }));

    console.log("Sending to Python:", cleanLogs);

    python.stdin.write(JSON.stringify(cleanLogs));
    python.stdin.end();

  } catch (err) {

    console.error("Analyze health error:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});

// POST /api/health/log
router.post("/log", async (req, res) => {
  console.log("---- /api/health/log HIT ----");
  console.log("BODY:", req.body);

  try {
    const { userId, mental, physical, timestamp } = req.body;

    if (!userId) {
      console.log("Missing userId");
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    if (!mental && !physical) {
      console.log("Missing both mental and physical data");
      return res
        .status(400)
        .json({ success: false, message: "At least mental or physical data is required" });
    }

    const logData = {
      userId,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    };

    if (mental) {
      logData.mental = mental;
    }

    if (physical) {
      logData.physical = physical;
    }

    const log = await HealthLog.create(logData);

    console.log("Saved log:", log);
    res.json({ success: true, log });
  } catch (err) {
    console.error("Health log save error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
