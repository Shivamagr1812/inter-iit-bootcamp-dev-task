const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model so it can be used elsewhere in your project
module.exports = mongoose.model('User', UserSchema);
