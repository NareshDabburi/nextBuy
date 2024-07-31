const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleWare = require("../middleWare/authMiddleWare");

//add order items
router.post("/", authMiddleWare.protect, orderController.addOrderItems);

//get my orders
router.get("/mine", authMiddleWare.protect, orderController.getMyOrders);

//get my order
router.get("/:id", authMiddleWare.protect, orderController.getOderById);

//updte order by ID
router.put("/:id", authMiddleWare.protect, orderController.updateOrderToPaid);

//updte order to pay
router.put(
  "/:id/pay",
  authMiddleWare.protect,
  orderController.updateOrderToPaid
);

//updte order to delivered
router.put(
  "/:id/deliver",
  authMiddleWare.protect,
  authMiddleWare.admin,
  orderController.updateOrderToDelivered
);

//get all orders
router.get(
  "/",
  authMiddleWare.protect,
  authMiddleWare.admin,
  orderController.getOrders
);

module.exports = router;
