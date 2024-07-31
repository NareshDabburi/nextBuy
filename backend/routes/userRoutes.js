const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleWare = require("../middleWare/authMiddleWare");

router.post("/login", userController.authUser);
router.post("/register", userController.registerUser);
router.post("/logout", authMiddleWare.protect, userController.logoutUser);

router.get("/profile", authMiddleWare.protect, userController.getUserProfile);

router.put(
  "/profile",
  authMiddleWare.protect,
  userController.updateUserProfile
);

router.put(
  "/users",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.getUsers
);

router.get(
  "/users/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.getUsers
);

router.put(
  "/users/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.getUsers
);

router.delete(
  "/users/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.getUsers
);

module.exports = router;
