const path = require("path");

// Project root directory
const projectRoot = path.join(__dirname, "..", "..");

// Profiles directory where astronaut files will be saved
const profilesDir = path.join(projectRoot, "public", "assets", "profiles");

module.exports = {
  projectRoot,
  profilesDir,
};
