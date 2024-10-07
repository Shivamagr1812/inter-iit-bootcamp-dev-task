const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middlewares/errorHandler');
const AuthRoutes = require("./routes/authRoutes");
require("./db");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(chatRoutes);
app.use(AuthRoutes);


// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
