const Photo = require("../models/Photo");

exports.uploadPhoto = async (req, res) => {
  try {

    const { userId, password, title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const newPhoto = new Photo({
      userId,
      password,
      title,
      image: req.file.filename
    });

    await newPhoto.save();

    res.status(200).json({
      message: "Photo uploaded successfully",
      photo: newPhoto
    });

  } catch (error) {

    res.status(500).json({
      message: "Upload failed",
      error: error.message
    });

  }
};



exports.getPhotos = async (req, res) => {
  try {

    const { userId, password } = req.body;

    const photos = await Photo.find({
      userId,
      password
    });

    res.status(200).json(photos);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching photos",
      error: error.message
    });

  }
};