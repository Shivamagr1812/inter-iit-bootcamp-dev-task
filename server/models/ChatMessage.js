const mongoose = require('mongoose');

// Define the ChatMessage schema
const ChatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // This links the message to a user in the User collection
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
