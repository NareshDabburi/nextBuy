const products = require("../data/products");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
//@desc fetch all products
// api path /api/products/cartModel
exports.getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await productModel.countDocuments({ ...keyword });
  const products = await productModel
    .find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
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
  const {
    name,
    price,
    description,
    image,
    images,
    brand,
    category,
    countInStock,
  } = req.body;
  const product = await productModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product Not Found");
  }

  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.image = req.body.image;
  product.images = req.body.images;
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
  const product = await productModel.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product Not found");
  }
  await product.deleteOne({ _id: product._id });
  res.status(200).json({ message: "Product Deleted" });
});

//@desc create a new review
//@route POST /api/products/:id/reviews
//@access Private
exports.createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await productModel.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => Number(item.rating) + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Get top rated product
//@route GET /api/products/top
//@access Public
exports.getTopProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

//@desc POST save cart items
//@route POST /api/products/saveCart
//@access private
exports.saveCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("IN");
  const existingCart = await cartModel.findOne({ user: req.user._id });
  console.log(existingCart);
  if (existingCart) {
    existingCart.cartItems = req.body;
    const saveCartItems = await existingCart.save();
    res.status(200).json(saveCartItems);
  } else {
    const cart = new cartModel({
      user: req.user._id,
      cartItems: req.body,
    });
    //const isCartExists = await cartModel.findOne({ user: req.user._id });

    const saveCartItems = cart.save();
    res.status(200).json(saveCartItems);
  }
});

//@desc GET get saved cart items
//@route POST /api/products/getCart
//@access private
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await cartModel.findOne({ user: req.user._id }).sort({ _id: 1 });
  const cartItems = cart?.cartItems;
  res.status(200).json(cartItems);
});
