const products = require("../data/products");
const productModel = require("../models/productModel");
const asyncHandler = require("express-async-handler");
//@desc fetch all products
// api path /api/products/getAllProducts
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find();
  res.status(200).json(products);
});

//@desc fetch a product based on id
// api path /api/products/getProduct/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findOne({ _id: req.params.id });
  if (!product) {
    res.status(404);
    throw new Error("Product Not Found");
  }
  res.status(200).send(product);
});
