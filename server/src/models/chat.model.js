const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "ai"],
  },
  content: {
    type: String,
    required: true,
  },
});

const chatSchema = new mongoose.Schema(
  {
    messages: [messageSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
