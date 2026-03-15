// backend/routes/migrationRoutes.js

const express = require('express');
const router = express.Router();
const migrationController = require('../controllers/migrationController');

// POST /api/migrate/astronaut
router.post('/astronaut', migrationController.migrateAstronaut);

module.exports = router;
