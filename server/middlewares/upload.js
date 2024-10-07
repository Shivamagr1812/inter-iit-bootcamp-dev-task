const multer = require("multer");

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Define the upload directory

module.exports = upload;
