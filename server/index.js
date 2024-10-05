const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
