const mongoose = require('mongoose');

const astronautPlainSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      index: true
    },

    // Plain (decrypted) fields
    fullName: { type: String, trim: true },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    bloodType: { type: String, trim: true },

    medicalHistory: { type: String, trim: true },
    allergies: { type: String, trim: true },
    medications: { type: String, trim: true },
    fitnessLevel: { type: String, trim: true },

    previousMissions: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    notes: { type: String, trim: true },

    // last time plain copy updated
    savedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

astronautPlainSchema.index({ userId: 1 });

module.exports = mongoose.model('AstronautPlain', astronautPlainSchema);
