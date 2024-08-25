const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const userModel = require("../models/userModel");
const { bgCyan } = require("colors");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const cartModel = require("../models/cartModel");
const wishlistModel = require("../models/wishListModel");
const { use } = require("../routes/productRoute");

//@desc Login User
//@route POST /api/users/register
//@access public
exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne(
    { email },
    { createdAt: 0, __v: 0, updatedAt: 0 }
  );

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  generateToken(res, user._id);

  // check if this user has cart Items
  const cart = await cartModel.findOne({ user: user._id }).sort({ _id: 1 });
  const cartItems = cart?.cartItems || [];

  //check if this user has whishlist items

  const wishList = await wishlistModel
    .findOne({ user: user._id })
    .sort({ _id: 1 });
  const wishlistItems = wishList?.wishlistItems;

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    cartItems,
    wishlistItems,
  });
});

//@desc Register User
//@route POST /api/users/register
//@access public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    isAdmin,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
  res.status(400);
  throw new Error("Invalid user data");
});

//@desc Logout User
//@route POST /api/users/logout
//@access Private
exports.logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

//@desc  user User
//@route GET /api/users/profile
//@access Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

//@desc  update User
//@route PUT /api/users/profile
//@access Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashPassword;
  }
  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

//@desc  get all Users
//@route GET /api/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json(users);
});

//@desc  get User
//@route GET /api/users/:id
//@access Private/Admin
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await userModel
    .findOne({ _id: req.params.id })
    .select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc  update User
//@route PUT /api/users/:id
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = Boolean(req.body.isAdmin);
  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    isAdmin: updatedUser.isAdmin,
  });
});

//@desc  Delete Users
//@route DELETE /api/users/:id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot Delete Admin User");
  }

  await userModel.deleteOne({ _id: user._id });
  res.status(200).send("User Deleted Successfully");
});
