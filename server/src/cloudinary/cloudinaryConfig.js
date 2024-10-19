// cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // replace with your Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY, // replace with your API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // replace with your API Secret
});

module.exports = cloudinary;
