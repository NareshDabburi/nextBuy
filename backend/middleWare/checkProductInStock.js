const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
exports.productInStock = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  let outOfStockItems = [];
  await Promise.all(
    order.orderItems.map(async (orderItem) => {
      const qty = orderItem.qty;
      const productId = orderItem.product;
      const product = await Product.findById(productId);
      const remainingProducts = product.countInStock - qty; // add a check if required
      if (remainingProducts < 0) {
        outOfStockItems.push(product.name);
      }
    })
  );
  if (outOfStockItems.length > 0) {
    res.status(400);
    throw new Error(outOfStockItems + " not in stock");
  }
  next();
});
