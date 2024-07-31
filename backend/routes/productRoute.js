const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProduct/:id", productController.getProduct);

module.exports = router;
