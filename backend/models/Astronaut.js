// backend/models/Astronaut.js

const mongoose = require('mongoose');

const astronautSchema = new mongoose.Schema(
  {
    // Account fields
    userId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    passwordHash: {
      type: String
    },

    // Personal Information - encrypted strings
    fullName: { type: String, trim: true },
    age: { type: String, trim: true },
    height: { type: String, trim: true },
    weight: { type: String, trim: true },
    bloodType: { type: String, trim: true },

    // Medical Information
    medicalHistory: { type: String, trim: true },
    allergies: { type: String, trim: true },
    medications: { type: String, trim: true },
    fitnessLevel: { type: String, trim: true },

    // Mission Information
    previousMissions: { type: String, trim: true },

    // Emergency Contact
    emergencyContact: { type: String, trim: true },

    // Additional Notes
    notes: { type: String, trim: true },

    savedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

astronautSchema.index({ createdAt: -1 });
astronautSchema.index({ fullName: 'text' });
astronautSchema.index({ userId: 1 });

module.exports = mongoose.model('Astronaut', astronautSchema);
