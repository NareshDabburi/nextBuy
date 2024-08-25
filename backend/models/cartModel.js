const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    brand: {
      type: String,
      required: [true, "brand is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    countInStock: {
      type: Number,
      required: [true, "countInStock is required"],
    },
    qty: {
      type: Number,
      required: [true, "qty is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cartItems", cartItemSchema);

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: [true, "user is required"],
      ref: "user",
    },
    cartItems: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
