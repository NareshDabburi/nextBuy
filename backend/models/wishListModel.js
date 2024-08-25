const mongoose = require("mongoose");

const wishlistItemSchema = mongoose.Schema(
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
  },
  { timestamps: true }
);

const wishlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: [true, "user is required"],
      ref: "user",
    },
    wishlistItems: [wishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("wishlist", wishlistSchema);
