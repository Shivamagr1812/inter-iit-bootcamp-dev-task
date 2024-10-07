const mongoose = require("mongoose");

mongoose
  .connect(process.env.dbURI)
  .then(() => {
      console.log("DB connected!");
  })
  .catch((err) => console.log(err));