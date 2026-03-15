// backend/controllers/migrationController.js

const Astronaut = require('../models/Astronaut');
const DecryptedAstronaut = require('../models/DecryptedAstronaut');
const { decryptAstronautDoc } = require('../utils/decryptFrontendData');
const crypto = require('crypto');

// Hardcoded example admin password hash (sha256); better is bcrypt + users table
const ADMIN_PASSWORD_HASH = crypto
  .createHash('sha256')
  .update(process.env.MIGRATION_ADMIN_PASSWORD || 'super_admin_pass')
  .digest('hex');

exports.migrateAstronaut = async (req, res) => {
  try {
    const { astronautId, adminPassword } = req.body;

    if (!astronautId || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: 'astronautId and adminPassword are required'
      });
    }

    // Verify admin password
    const providedHash = crypto
      .createHash('sha256')
      .update(adminPassword)
      .digest('hex');

    if (providedHash !== ADMIN_PASSWORD_HASH) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin password'
      });
    }

    // Load encrypted doc from main collection
    const astro = await Astronaut.findById(astronautId);
    if (!astro) {
      return res.status(404).json({
        success: false,
        message: 'Astronaut not found'
      });
    }

    // Decrypt fields
    const decrypted = decryptAstronautDoc(astro);

    // Save into new collection
    const migrated = await DecryptedAstronaut.create({
      ...decrypted,
      sourceAstronautId: astro._id
    });

    return res.json({
      success: true,
      message: 'Astronaut decrypted and migrated successfully',
      decryptedId: migrated._id
    });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Migration failed'
    });
  }
};
