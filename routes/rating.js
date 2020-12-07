const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const {
  getRatings,
  postRating,
  updateRating,
  getRatingsForUser,
  getOrdersForUserToRate,
  flagRating,
  getCountOrdersForUserToRate,
} = require("../controllers/rating");

const { isUserAlreadyInRating, isAdmin } = require("../validation");

// @Route            >   GET  /api/v1/:user_id/:product_id/rating
// @Description      >   Get all ratings for a particular product
// @Access Control   >   Public
router.get("/", getRatings);

// @Route            >   GET  /api/v1/:user_id/:product_id/rating/user
// @Description      >   Get all ratings for a particular user
// @Access Control   >   Private
router.get("/user", isAuthenticated, isAuthorized, getRatingsForUser);

// @Route            >   GET  /api/v1/:user_id/:product_id/rating/rate
// @Description      >   Get all un-rated orders for a particular user
// @Access Control   >   Private
router.get("/rate", isAuthenticated, isAuthorized, getOrdersForUserToRate);

// @Route            >   GET  /api/v1/:user_id/:product_id/rating/count
// @Description      >   Get all un-rated orders for a particular user
// @Access Control   >   Private
router.get(
  "/count",
  isAuthenticated,
  isAuthorized,
  getCountOrdersForUserToRate
);

// @Route            >   POST  /api/v1/:user_id/:product_id/rating/:order_id
// @Description      >   Post a rating for a particular product
// @Access Control   >   Private
router.post(
  "/:order_id",
  isAuthenticated,
  isAuthorized,
  isUserAlreadyInRating,
  postRating
);

// @Route            >   PUT  /api/v1/:user_id/:product_id/rating/:rating_id/update
// @Description      >   Update a rating for a particular product
// @Access Control   >   Private
router.put("/:rating_id/update", isAuthenticated, isAuthorized, updateRating);

// @Route            >   PUT  /api/v1/:user_id/:product_id/rating/:rating_id/flag
// @Description      >   Flag a rating
// @Access Control   >   Admin
router.put("/:rating_id/flag", isAuthenticated, isAdmin, flagRating);

module.exports = router;
