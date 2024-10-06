const app = require("./src/app");
const dbConnect = require("./src/db/db");
require("dotenv").config();

// Connect database
dbConnect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error : ", err);
  });

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started successfully at : http://localhost:${PORT}`);
});
