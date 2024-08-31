// routes/uploadRoutes.js

const express = require('express');
const upload = require('../middlewares/multer'); // Import multer middleware

const router = express.Router();

// Endpoint to handle multiple file uploads
router.post('/upload', upload.fields([{ name: 'business_permit', maxCount: 1 }, { name: 'gym_logo', maxCount: 1 }]), (req, res) => {
  if (req.files) {
    // Normalize the paths by replacing backslashes with forward slashes
    Object.keys(req.files).forEach(key => {
      req.files[key].forEach(file => {
        file.path = file.path.replace(/\\/g, '/'); // Replace \ with /
      });
    });

    // Respond with JSON data containing information about the uploaded files
    res.json(req.files);
    console.log(req.files);
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

// Endpoint to handle single file upload
router.post('/uploadSingle', upload.single('file'), (req, res) => {
  if (req.file) {
    // Normalize the path by replacing backslashes with forward slashes
    req.file.path = req.file.path.replace(/\\/g, '/');
    // Respond with JSON data containing information about the uploaded file
    res.json(req.file);
    console.log(req.file);
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

module.exports = router;
