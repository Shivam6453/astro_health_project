const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- STATIC FOLDER ---------------- */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- MULTER SETUP ---------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/* ---------------- USER DATABASE FILE ---------------- */

const USERS_FILE = "users.json";

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

/* ---------------- UPLOAD PHOTO ---------------- */

app.post("/upload", upload.single("photo"), (req, res) => {

  const { userId, title } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  let user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const photoData = {
    id: uuidv4(),
    title: title,
    path: req.file.filename
  };

  if (!user.gallery) {
    user.gallery = [];
  }

  user.gallery.push(photoData);

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json(photoData);
});

/* ---------------- GET USER GALLERY ---------------- */

app.get("/gallery/:userId", (req, res) => {

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const user = users.find((u) => u.id === req.params.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.gallery || []);
});

/* ---------------- MONGODB CONNECTION ---------------- */

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/astronaut-health";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err.message));

/* ---------------- ROUTES ---------------- */

const astronautRoutes = require("./routes/astronautRoutes");
app.use("/api/astronauts", astronautRoutes);

const healthRoutes = require("./routes/healthRoutes");
app.use("/api/health", healthRoutes);

/* ---------------- CHATBOT ROUTE ---------------- */

const companionRoutes = require("./routes/companionRoutes");
app.use("/api/companion", companionRoutes);

const photoRoutes = require("./routes/photoRoutes");
app.use("/api/photos", photoRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/health", (req, res) => {
  res.json({ status: "Backend working" });
});

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});