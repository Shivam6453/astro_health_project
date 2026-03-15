const fs = require("fs");
const path = require("path");
const { profilesDir } = require("../config/paths");

// Create profiles folder if it doesn't exist
function ensureProfilesDir() {
  if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
    console.log("✓ Created profiles directory:", profilesDir);
  }
}

// Save profile to file
function saveProfile(astronautName, fileContent) {
  try {
    ensureProfilesDir();

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedName = astronautName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `astronaut_${sanitizedName}_${timestamp}.txt`;
    const filePath = path.join(profilesDir, fileName);

    // Write file
    fs.writeFileSync(filePath, fileContent, "utf8");

    console.log(`✓ Profile saved: ${fileName}`);

    return {
      success: true,
      fileName: fileName,
      filePath: filePath,
      message: "Profile saved successfully!",
    };
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    throw error;
  }
}

// Get all profiles
function getAllProfiles() {
  try {
    ensureProfilesDir();
    const files = fs.readdirSync(profilesDir);
    return {
      success: true,
      profiles: files,
      count: files.length,
    };
  } catch (error) {
    console.error("❌ Error reading profiles:", error);
    throw error;
  }
}

module.exports = {
  saveProfile,
  getAllProfiles,
  ensureProfilesDir,
};
