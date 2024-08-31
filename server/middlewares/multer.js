// middlewares/multer.js

const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    // Create a unique file name with timestamp and original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize and export upload variable with multer configuration
const upload = multer({ storage: storage });

module.exports = upload;
