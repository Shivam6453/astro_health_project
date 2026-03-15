// backend/controllers/astronautController.js

const Astronaut = require('../models/Astronaut');
const AstronautPlain = require('../models/AstronautPlain');
const crypto = require('crypto');
const { decryptAstronautDoc } = require('../utils/decryptFrontendData');

// ✅ Save Astronaut Profile (encrypted + plain copy)
exports.saveAstronautProfile = async (req, res) => {
  try {
    console.log('REQ BODY >>>', JSON.stringify(req.body, null, 2));

    const { astronautData, userId, password } = req.body;

    if (!astronautData || Object.keys(astronautData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No astronaut data provided'
      });
    }
    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'userId and password are required'
      });
    }

    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    // ---------- 1) Encrypted collection: Astronaut ----------
    let astronaut = await Astronaut.findOne({ userId });

    if (!astronaut) {
      astronaut = new Astronaut({
        userId,
        passwordHash,
        ...astronautData,
        savedAt: new Date()
      });
    } else {
      astronaut.passwordHash = passwordHash;
      astronaut.set({
        ...astronautData,
        savedAt: new Date()
      });
    }

    await astronaut.save();

    // ---------- 2) Plain collection: AstronautPlain ----------
    // encrypted doc ko backend key se decrypt karke plain object banao
    const plainProfile = decryptAstronautDoc(astronaut);

    let plain = await AstronautPlain.findOne({ userId });

    if (!plain) {
      plain = new AstronautPlain({
        userId,
        ...plainProfile,
        savedAt: new Date()
      });
    } else {
      plain.set({
        ...plainProfile,
        savedAt: new Date()
      });
    }

    await plain.save();

    // ---------- 3) blockchain hash dummy ----------
    const blockchainHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(astronautData) + new Date().toISOString())
      .digest('hex');

    res.status(201).json({
      success: true,
      message: 'Profile saved successfully with encryption + plain copy',
      blockchainHash,
      astronautId: astronaut._id,
      savedAt: astronaut.createdAt
    });
  } catch (error) {
    console.error('Error saving astronaut profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save profile'
    });
  }
};

// ✅ Login + decrypt (userId + password → plain profile)
exports.loginAndDecrypt = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'userId and password are required'
      });
    }

    const astronaut = await Astronaut.findOne({ userId });

    if (!astronaut) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const providedHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (providedHash !== astronaut.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // yahan se runtime decrypt bhi mil raha hai (frontend ke liye)
    const decryptedProfile = decryptAstronautDoc(astronaut);

    return res.json({
      success: true,
      message: 'Decrypted profile loaded',
      profile: decryptedProfile
    });
  } catch (error) {
    console.error('Login/decrypt error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to decrypt profile'
    });
  }
};
