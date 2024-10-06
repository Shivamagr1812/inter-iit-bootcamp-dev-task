const express = require('express');
const { upload, transcribeAudio } = require('../controllers/transcriptionController');
const router = express.Router();

// Route for uploading and transcribing audio
router.post('/transcribe', upload.single('audio'), transcribeAudio);

module.exports = router;
