const path = require("path");
const express = require("express");
const products = require("./data/products");
const productRoutes = require("./routes/productRoute");
const dotenv = require("dotenv").config();
const dbConnection = require("./config/dbConnection");
const errorMiddleWare = require("./middleWare/errorMiddleWare");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const uploadS3Routes = require("./routes/uploadToS3Routes");
const downloadS3Routes = require("./routes/downloadFromS3");
const wishListRoutes = require("./routes/wishListRoute");
const cookieParser = require("cookie-parser");
const app = express();
dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/uploads/s3", uploadS3Routes);
app.use("/api/downloads/s3", downloadS3Routes);
app.use("/api/wishlist", wishListRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

//healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({ message: process.env.NODE_ENV });
});

//make upload folder as static folder
__dirname = path.resolve(); // Set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.use(errorMiddleWare.notFound);
app.use(errorMiddleWare.errorHandler);

const PORT = process.env.PORT || 7000;
console.log(process.env.PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
