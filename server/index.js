const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// routes importing 
const chatRoutes = require("./routes/chatRoutes");
// const transcriptionRoutes = require("./routes/transcriptionRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Add a root route


// Chat route 
app.use("/chat", chatRoutes);
// Transcription route 
// app.use("/transcription", transcriptionRoutes);

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
