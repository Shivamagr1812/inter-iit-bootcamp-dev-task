// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Routes importing 
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require("./routes/upload"); // Import upload routes

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://bootcampinteriit.netlify.app'], // Allow both localhost and hosted frontend
}));

app.use(bodyParser.json());

// Chat route 
app.use("/chat", chatRoutes);
app.use("/api", uploadRoutes); // Integrate upload routes

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Handle errors globally
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
