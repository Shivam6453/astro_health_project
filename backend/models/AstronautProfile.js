const mongoose = require("mongoose");

const AstronautProfileSchema = new mongoose.Schema(
  {
    // Encrypted fields
    fullName: { type: String, required: true },
    age: String,
    height: String,
    weight: String,
    bloodType: String,
    medicalHistory: String,
    allergies: String,
    medications: String,
    fitnessLevel: String,
    spaceMissions: String,
    emergencyContact: String,
    notes: String,

    // Blockchain & Security
    blockchainHash: { type: String, required: true },
    previousHash: String,
    timestamp: { type: Date, default: Date.now },
    nonce: { type: Number, default: 0 },

    // Metadata
    isEncrypted: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AstronautProfile", AstronautProfileSchema);
