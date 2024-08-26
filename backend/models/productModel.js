const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    rating: {
      type: String,
      required: [true, "rating is required"],
    },
    comment: {
      type: String,
      required: [true, "comment is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reviews", reviewSchema);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: [true, "user is required"],
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    images: [
      {
        type: String,
        required: [true, "image is required"],
      },
    ],
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
    reviews: [reviewSchema],
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    countInStock: {
      type: Number,
      required: [true, "countInStock is required"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      default: 0,
    },
    numReviews: {
      type: Number,
      required: [true, "numReviews is required"],
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
