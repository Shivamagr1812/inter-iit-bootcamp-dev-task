const express = require('express');
const { askQuestion } = require('../controllers/questionController');
const { askFileQuestion } = require('../controllers/questionFileController');
const upload = require('../middleware/upload');

const router = express.Router();

// Route for text-based questions
router.post('/', askQuestion);

// Route for file-based questions
router.post('/file', upload, askFileQuestion);

module.exports = router;




// const express = require('express');
// const { askQuestion } = require('../controllers/questionController');
// const upload = require('../middleware/upload'); // Import the upload middleware

// const router = express.Router();

// // Route for asking a question (text)
// router.post('/ask', askQuestion);

// // Route for uploading a file
// // router.post('/upload', upload, uploadFile); // Use the upload middleware here

// module.exports = router;




// const express = require('express');
// const { askQuestion, uploadFile } = require('../controllers/questionController');
// const multer = require('multer');

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' }); // Define storage location for uploaded files

// const router = express.Router();

// // Route for asking a question (text)
// router.post('/ask', askQuestion);

// // Route for uploading a file
// router.post('/upload', upload.single('file'), uploadFile); // 'file' is the name of the input field in the frontend

// module.exports = router;



// const express = require('express');
// const { askQuestion } = require('../controllers/questionController');

// const router = express.Router();

// // Route for handling the question
// router.post('/', askQuestion);

// module.exports = router;
