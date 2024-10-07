const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, required: true },
		conversation: [
			{
				role: { type: String, required: true },
				content: { type: String, required: true },
				timestamp: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ChatLog', chatLogSchema);
