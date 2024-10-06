const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// routes importing 
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  // origin: 'https://bootcampinteriit.netlify.app/',
}));
app.use(bodyParser.json());

// Add a root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Chat API!'); // Change this message as needed
// });

// Chat route 
app.use("/chat", chatRoutes);

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
