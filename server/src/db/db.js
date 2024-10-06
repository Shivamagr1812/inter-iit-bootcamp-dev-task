const mongoose = require("mongoose");

const dbConnect = (URL) => {
  return mongoose.connect(URL);
};

module.exports = dbConnect;
