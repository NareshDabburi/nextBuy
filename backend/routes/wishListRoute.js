const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleWare/authMiddleWare");
const wishlistController = require("../controllers/wishListController");

router.post(
  "/addToWishlist",
  authMiddleWare.protect,
  wishlistController.saveWishlist
);

router.get("/", authMiddleWare.protect, wishlistController.getWishListItems);

module.exports = router;
