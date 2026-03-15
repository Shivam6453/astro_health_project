const mongoose = require("mongoose");

const mentalSchema = new mongoose.Schema(
  {
    stress: { type: Number, min: 0, max: 10, required: true },
    anxiety: { type: Number, min: 0, max: 10, required: true },
    isolation: { type: Number, min: 0, max: 10, required: true },
    focus: { type: Number, min: 0, max: 10, required: true },
    sleep: { type: Number, min: 0, max: 10, required: true },
    mood: { type: Number, min: 0, max: 10, required: true },
    moodCategory: {
      type: String,
      enum: ["happy", "neutral", "sad", "anxious", "energetic"],
      required: true,
    },
  },
  { _id: false }
);

const physicalSchema = new mongoose.Schema(
  {
    heartRate: Number,
    systolicBP: Number,
    diastolicBP: Number,
    spo2: Number,
    temperature: Number,
    steps: Number,
  },
  { _id: false }
);

const healthLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    mental: { type: mentalSchema },
    physical: { type: physicalSchema },
  },
  { collection: "healthLogs" }
);

// Fast queries: per-user, sorted by time
healthLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("HealthLog", healthLogSchema);
