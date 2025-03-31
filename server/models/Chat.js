const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  aiResponse: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
