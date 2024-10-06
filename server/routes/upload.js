const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../File');
    // Ensure the upload path exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid conflicts
  },
});

const upload = multer({ storage: storage });

// Route to handle file uploads
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // The file is already saved to disk by multer, we can now respond
  console.log(`Uploaded file: ${req.file.filename}, Size: ${req.file.size} bytes`);

  // Respond with a success message
  res.status(200).json({ message: 'File uploaded successfully', fileName: req.file.filename });
});

module.exports = router;
