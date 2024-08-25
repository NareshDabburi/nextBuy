const wishlistModel = require("../models/wishListModel");
const asyncHandler = require("express-async-handler");
//@desc add wishList items for the user
//@route POST /api/wishlist/addToWishlist
//@access Private
exports.saveWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const existingWishlist = await wishlistModel.findOne({ user: req.user._id });
  if (existingWishlist) {
    existingWishlist.wishlistItems = req.body;
    const saveWishlistItems = await existingWishlist.save();
    res.status(200).json(saveWishlistItems);
  } else {
    const wishlist = new wishlistModel({
      user: req.user._id,
      wishlistItems: req.body,
    });

    const saveWishlistItems = await wishlist.save();
    res.status(200).json(saveWishlistItems);
  }
});

//@desc get wishList items for the user
//@route GET /api/wishlist/api/wishList
//@access Private
exports.getWishListItems = asyncHandler(async (req, res) => {
  const wishList = await wishlistModel
    .findOne({ user: req.user._id })
    .sort({ _id: 1 });
  const wishlistItems = wishList?.wishlistItems;
  res.status(200).json(wishlistItems);
});
