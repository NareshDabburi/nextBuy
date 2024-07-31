const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const dbConnection = asyncHandler(async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("DB connected");
  } catch (err) {
    console.log("DB not connected", err);
    process.exit(1);
  }
});
module.exports = dbConnection;
