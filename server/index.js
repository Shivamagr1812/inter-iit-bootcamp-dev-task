const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { fileStorage } = require('./config');
const { registerUserController, logInUserController, verifyToken } = require("./controllers/authControllers");
const { chatWithGeminiController } = require("./controllers/chatControllers");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  registerUserController(req, res);
})

app.post('/auth', async (req, res) => {
  logInUserController(req, res);
})

app.post("/chat", fileStorage.single('file'), async (req, res) => {
  chatWithGeminiController(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
