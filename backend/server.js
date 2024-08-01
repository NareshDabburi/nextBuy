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

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

//make upload folder as static folder
__dirname = path.resolve(); // Set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorMiddleWare.notFound);
app.use(errorMiddleWare.errorHandler);

const PORT = process.env.PORT || 7000;
console.log(process.env.PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
