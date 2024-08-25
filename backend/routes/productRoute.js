const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleWare/authMiddleWare");
const productController = require("../controllers/productController");

router.get("/getAllProducts", productController.getAllProducts);

router.get("/getProduct/:id", productController.getProduct);
router.post(
  "/",
  authMiddleWare.protect,
  authMiddleWare.admin,
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleWare.protect,
  authMiddleWare.admin,
  productController.deleteProduct
);

router.post(
  "/:id/reviews",
  authMiddleWare.protect,
  productController.createProductReview
);
router.get("/top", productController.getTopProducts);
router.post("/saveCart", authMiddleWare.protect, productController.saveCart);
router.get("/getCart", authMiddleWare.protect, productController.getCart);

module.exports = router;
