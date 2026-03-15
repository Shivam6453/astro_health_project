// backend/routes/astronautRoutes.js

const express = require('express');
const router = express.Router();

const astronautController = require('../controllers/astronautController');

// ✅ Save encrypted profile (+ plain copy if controller me added hai)
router.post(
  '/save-astronaut-profile',
  astronautController.saveAstronautProfile
);

// ✅ Login + decrypt profile (userId + password required)
router.post(
  '/login-and-decrypt',
  astronautController.loginAndDecrypt
);

// Alias for login
router.post(
  '/login',
  astronautController.loginAndDecrypt
);

module.exports = router;
