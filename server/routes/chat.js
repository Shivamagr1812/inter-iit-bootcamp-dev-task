const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const { authenticateToken } = require('../middleware/authenticateToken');
const ChatLog = require('../models/chatlog');
const router = express.Router();
const geminiApiKey = process.env.GEMINI_API_KEY;

// File type and size validation
const upload = multer({
	dest: 'uploads/',
	limits: { fileSize: 20 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const fileTypes = /text|csv|json|pdf/;
		const mimeTypes = [
			'text/plain',
			'text/csv',
			'application/json',
			'application/pdf',
		];
		const mimeType = mimeTypes.includes(file.mimetype);
		const extname = fileTypes.test(
			file.originalname.split('.').pop().toLowerCase()
		);

		if (mimeType && extname) {
			return cb(null, true);
		}
		cb(new Error('File type not supported'));
	},
});

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({
	model: 'gemini-1.5-flash',
});

// Configuration for generation
const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 8192,
	responseMimeType: 'text/plain',
};

// For one query
const generateResponse = async (question, fileContent) => {
	try {
		const chatSession = model.startChat({
			generationConfig,
			history: [],
		});

		const message = fileContent ? `${fileContent}\n${question}` : question;

		const result = await chatSession.sendMessage(message);
		return result.response.text();
	} catch (error) {
		console.error('Error:', error);
		return 'An error occurred while processing your request.';
	}
};

//chat handled here

const mongoose = require('mongoose');

router.post('/', upload.single('file'), async (req, res) => {
	const userQuestion = req.body.question;
	const file = req.file;
	let fileContent = '';

	if (file) {
		try {
			fileContent = await fs.readFile(file.path, 'utf-8');
			await fs.unlink(file.path); // Clean
		} catch (error) {
			console.error('File read error:', error);
			return res.status(500).json({ error: 'File read failed.' });
		}
	}

	try {
		const responseText = await generateResponse(userQuestion, fileContent);
		const userId = req.user
			? req.user._id
			: new mongoose.Types.ObjectId('000000000000000000000000'); // Guest user ID

		await new ChatLog({
			userId: userId, // Use guest ID
			conversation: [
				{
					role: 'user',
					content: userQuestion,
					timestamp: new Date(),
				},
				{
					role: 'bot',
					content: responseText,
					timestamp: new Date(),
				},
			],
		}).save();

		res.json({ answer: responseText });
	} catch (error) {
		console.error('Error:', error);
		res
			.status(500)
			.json({ error: 'An error occurred while processing your request.' });
	}
});

// multer
router.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		res.status(400).json({ error: `Multer error: ${err.message}` });
	} else if (err) {
		res.status(400).json({ error: `Error: ${err.message}` });
	} else {
		next();
	}
});

module.exports = router;
