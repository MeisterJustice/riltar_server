const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const {
  getOrders,
  getOrder,
  postOrder,
  cancelOrder,
  confirmOrder,
  getSells,
  getUndeliveredSellsCount,
} = require("../controllers/order");

// @Route            >   GET  /api/v1/:user_id/order
// @Description      >   Get all orders for a particular user
// @Access Control   >   Private
router.get("/", isAuthenticated, isAuthorized, getOrders);

// @Route            >   GET  /api/v1/:user_id/order/sell
// @Description      >   Get all sells for a particular user
// @Access Control   >   Private
router.get("/sell", isAuthenticated, isAuthorized, getSells);

// @Route            >   GET  /api/v1/:user_id/order/count
// @Description      >   Get number of undelivered sells for a particular user
// @Access Control   >   Private
router.get("/count", isAuthenticated, isAuthorized, getUndeliveredSellsCount);

// @Route            >   GET  /api/v1/:user_id/order/:order_id
// @Description      >   Get an order
// @Access Control   >   Private
router.get("/:order_id", isAuthenticated, isAuthorized, getOrder);

// @Route            >   PUT  /api/v1/:user_id/order/:order_id/confirm
// @Description      >   Update an order
// @Access Control   >   Private
router.put("/:order_id/confirm", isAuthenticated, confirmOrder);

// @Route            >   PUT  /api/v1/:user_id/order/:order_id/cancel
// @Description      >   Update an order
// @Access Control   >   Private
router.put("/:order_id/cancel", isAuthenticated, isAuthorized, cancelOrder);

// @Route            >   POST  /api/v1/:user_id/order/:cart_id/:product_id
// @Description      >   Post an order
// @Access Control   >   Private
router.post("/:cart_id/:product_id", isAuthenticated, postOrder);

module.exports = router;
