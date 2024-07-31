const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
// @desc Create new order
// POST /api/orders
// @access Private
exports.addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.lenght === 0) {
    res.status(400);
    throw new Error("No order Items");
  }
  const order = new Order({
    orderItems: orderItems.map((x) => ({
      ...x,
      product: x._id,
      _id: undefined,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createOrder = await order.save();
  res.status(200).json(createOrder);
});

// @desc Get logged in user orders
// GET /api/orders/mine
// @access Private/Admin
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc Get order by ID
// GET /api/orders/:id
// @access Private
exports.getOderById = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else;
  res.status(404);
  throw new Error("Order not found");
});

// @desc Update Order to Paid
// GET /api/orders/:id/pay
// @access Private
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send("update order to Paid");
});

// @desc Update Order to delivered
// GET /api/orders/:id/deliver
// @access Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("update order to delivered");
});

// @desc Update Order to delivered
// GET /api/orders
// @access Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});
