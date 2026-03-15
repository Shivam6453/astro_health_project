// backend/models/DecryptedAstronaut.js

const mongoose = require('mongoose');

const decryptedAstronautSchema = new mongoose.Schema(
  {
    fullName: String,
    age: Number,
    height: Number,
    weight: Number,
    bloodType: String,
    medicalHistory: String,
    allergies: String,
    medications: String,
    fitnessLevel: String,
    previousMissions: String,
    emergencyContact: String,
    notes: String,

    sourceAstronautId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Astronaut'
    },
    migratedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DecryptedAstronaut', decryptedAstronautSchema);
