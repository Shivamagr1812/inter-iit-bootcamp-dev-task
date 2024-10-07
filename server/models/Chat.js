const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

const ChatSchema = new mongoose.Schema({
  userId: { // Assuming each user has their own chat history
    type: String,
    required: true,
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', ChatSchema);
