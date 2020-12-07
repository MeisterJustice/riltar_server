require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { seed } = require("./seed");
// seed();

// MONGO SETUP ==============================
const { port, mongoConnectionString, mongoLocalString } = require("./config");

mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(
  mongoLocalString,
  {
    keepAlive: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("database connected");
  }
);
// =============================================

app.use(cors());
app.use(fileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// REQUIRE ROUTES AND CONFIGURE===============================
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const subcategoryRoute = require("./routes/subcategory");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const ratingRoute = require("./routes/rating");
const messageRoute = require("./routes/message");
const favoriteRoute = require("./routes/favorite");
const couponRoute = require("./routes/coupon");
const adminRoute = require("./routes/admin");
const reportProductRoute = require("./routes/reportProduct");
const supportRoute = require("./routes/support");
const searchRoute = require("./routes/search");
const viewRoute = require("./routes/view");
const payoutRoute = require("./routes/payout");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/view", viewRoute);
app.use("/api/v1/payout", payoutRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subcategory", subcategoryRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/:user_id/cart", cartRoute);
app.use("/api/v1/:user_id/order", orderRoute);
app.use("/api/v1/:user_id/:product_id/rating", ratingRoute);
app.use("/api/v1/:user_id/:product_id/report", reportProductRoute);
app.use("/api/v1/:user_id/support", supportRoute);
app.use("/api/v1/:user_id/favorite", favoriteRoute);
app.use("/api/v1/:user_id/coupon", couponRoute);
app.use("/api/v1/:user_id/admin", adminRoute);

// but if non of those routes are reached
app.use(function (req, res, next) {
  // we can render a not found page
  let err = new Error("NOT FOUND");
  err.status = 404;
  next(err);
});

// this helps to handle error appropriately in the client
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is starting on port ${port}`);
});
