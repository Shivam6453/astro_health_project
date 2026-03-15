const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Photo", PhotoSchema);