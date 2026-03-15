const express = require("express");
const router = express.Router();
const {
  saveAstronautProfile,
  loginAndDecrypt,
  decryptProfile,
  getAllProfiles,
  verifyBlockchainIntegrity,
} = require("../controllers/astronautController");

// Save encrypted profile with blockchain
router.post("/save-astronaut-profile", saveAstronautProfile);

// Login
router.post("/login", loginAndDecrypt);

// Decrypt profile (Admin only - requires password)
router.post("/decrypt-profile", decryptProfile);

// Get all profiles (Admin only)
router.post("/profiles", getAllProfiles);

// Verify blockchain integrity
router.get("/verify-blockchain", verifyBlockchainIntegrity);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "✓ Secure Backend Running",
    encryption: "AES-256",
    blockchain: "SHA-256 PoW",
  });
});

module.exports = router;
