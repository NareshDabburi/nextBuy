const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const dbConnection = asyncHandler(async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "DB connected",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log("DB not connected", err);
    process.exit(1);
  }
});
module.exports = dbConnection;
