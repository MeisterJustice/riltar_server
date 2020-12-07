const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const {
  getCarts,
  postCart,
  updateCart,
  deleteCart,
  applyCouponAndUpdateCart,
  getCart,
} = require("../controllers/cart");

// @Route            >   GET  /api/v1/:user_id/cart
// @Description      >   Get all cart items for a particular user
// @Access Control   >   Private
router.get("/", isAuthenticated, isAuthorized, getCarts);

// @Route            >   POST  /api/v1/:user_id/cart/coupon
// @Description      >   Apply Coupon
// @Access Control   >   Private
router.post("/coupon", isAuthenticated, isAuthorized, applyCouponAndUpdateCart);

// @Route            >   POST  /api/v1/:user_id/cart/:product_id
// @Description      >   Post a cart Item
// @Access Control   >   Private
router.post("/:product_id", isAuthenticated, isAuthorized, postCart);

// @Route            >   GET  /api/v1/:user_id/cart/:cart_id
// @Description      >   Get a cart Item
// @Access Control   >   Private
router.get("/:cart_id", isAuthenticated, isAuthorized, getCart);

// @Route            >   PUT  /api/v1/:user_id/cart/:cart_id
// @Description      >   Edit a cart Item
// @Access Control   >   Private
router.put("/:cart_id", isAuthenticated, isAuthorized, updateCart);

// @Route            >   DELETE  /api/v1/:user_id/cart/:cart_id
// @Description      >   Delete a cart Item
// @Access Control   >   Private
router.delete("/:cart_id", isAuthenticated, isAuthorized, deleteCart);

module.exports = router;
