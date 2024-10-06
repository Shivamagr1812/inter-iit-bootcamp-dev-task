const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const chatRoute = require('./routes/chatRoute');
const errorHandler = require('./middlewares/errorHandlers');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(chatRoute);


// Error handling middleware
app.use(errorHandler);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
