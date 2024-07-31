const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  //console.log(req);
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const user = await userModel.findById(decoded.userId).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("Not authorized,token failed");
  }
  req.user = user;
  next();
});

exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};
