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

router.get(
  "/",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.getUsers
);

router.get(
  "/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.getUserById
);

router.put(
  "/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  userController.deleteUser
);

module.exports = router;
