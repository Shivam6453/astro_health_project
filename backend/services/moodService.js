const { spawn } = require("child_process");
const path = require("path");

async function detectMoodFromImage(base64Image) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "..", "predict_mood.py");

    const py = spawn("python", [scriptPath]);
    
    // Handle spawn errors (e.g., python not found)
    py.on("error", (err) => {
      reject(new Error(`Failed to spawn Python process: ${err.message}`));
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    
    // Timeout handler (30 second limit)
    const timeout = setTimeout(() => {
      timedOut = true;
      py.kill();
      reject(new Error("Mood detection timeout after 30 seconds"));
    }, 30000);

    py.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    py.on("close", (code) => {
      clearTimeout(timeout);
      
      if (timedOut) return;  // Already rejected
      
      if (code !== 0) {
        return reject(new Error(`Python exited with code ${code}: ${stderr}`));
      }
      try {
        const json = JSON.parse(stdout);
        resolve(json);
      } catch (err) {
        reject(new Error(`Failed to parse python output: ${err.message} - output: ${stdout}`));
      }
    });

    // Validate base64 size before sending
    if (base64Image.length > 5 * 1024 * 1024) {
      reject(new Error("Image too large (>5MB)"));
      return;
    }

    const payload = { image: base64Image };
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}

module.exports = { detectMoodFromImage };
