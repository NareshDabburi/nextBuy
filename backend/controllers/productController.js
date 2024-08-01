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

//@desc create a product
//@route POST /api/products
//@access Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const product = new productModel({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  const createProduct = await product.save();
  res.status(201).json(createProduct);
});

//@desc update a product
//@route PUT /api/products/:id
//@access Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await productModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product Not Found");
  }
  console.log(product);
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.image = req.body.image;
  product.brand = req.body.brand;
  product.countInStock = req.body.countInStock;
  product.category = req.body.category;

  const updatedProduct = product.save();
  res.status(200).json(updatedProduct);
});

//@desc delete a product
//@route DELTE /api/products/:id
//@access Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  console.log("DELETE");
  const product = await productModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product Not found");
  }
  await product.deleteOne({ _id: product._id });
  res.status(200).json({ message: "Product Deleted" });
});
