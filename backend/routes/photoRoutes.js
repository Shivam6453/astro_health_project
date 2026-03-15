const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadPhoto,
  getPhotos
} = require("../controllers/photoController");

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }

});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadPhoto);

router.post("/getPhotos", getPhotos);

module.exports = router;