const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS and Session Configuration
// CORS options for Express
const corsOptions = {
	origin: 'http://localhost:3001',
	credentials: true,
};
app.use(require('cors')(corsOptions));
//routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3001', // Ensure CORS setting matches the front-end URL
		credentials: true,
	},
});

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
	const session = socket.request.session;
	if (session && session.userId) {
		console.log('Authenticated user:', session.userId);
		socket.on('send_message', async ({ question, fileContent }) => {
			try {
				const responseText = await generateResponse(question, fileContent);
				socket.emit('receive_response', { answer: responseText });
			} catch (error) {
				console.error('Error:', error);
				socket.emit('receive_response', { answer: 'An error occurred.' });
			}
		});
	} else {
		console.log('Unauthenticated access attempt');
		socket.disconnect(true);
	}
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
