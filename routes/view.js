const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const {
  getViews,
  getViewsForUser,
  getViewsForAUserProducts,
  getLimitedViews,
} = require("../controllers/view");

// @Route            >   GET  /api/v1/view
// @Description      >   Get all product views
// @Access Control   >   Public
router.get("/", getViews);

// @Route            >   GET  /api/v1/view/:user_id
// @Description      >   Get all product views for a particular user
// @Access Control   >   Private
router.get("/:user_id", isAuthenticated, isAuthorized, getViewsForUser);

// @Route            >   GET  /api/v1/view/:user_id/product
// @Description      >   Get all views for a particular user's products
// @Access Control   >   Private
router.get(
  "/:user_id/product",
  isAuthenticated,
  isAuthorized,
  getViewsForAUserProducts
);

// @Route            >   GET  /api/v1/view/:user_id/:limit
// @Description      >   Get limited views
// @Access Control   >   Private
router.get("/:user_id/:limit", isAuthenticated, isAuthorized, getLimitedViews);

module.exports = router;
