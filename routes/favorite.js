const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const {
  getFavorites,
  postFavorite,
  deleteFavorite,
} = require("../controllers/favorite");

// @Route            >   GET  /api/v1/:user_id/favorite
// @Description      >   Get all favorite products for a user
// @Access Control   >   Private
router.get("/", isAuthenticated, isAuthorized, getFavorites);

// @Route            >   POST  /api/v1/:user_id/favorite/:product_id
// @Description      >   Add product to favorite
// @Access Control   >   Private
router.post("/:product_id", isAuthenticated, isAuthorized, postFavorite);

// @Route            >   POST  /api/v1/:user_id/favorite/:favorite_id
// @Description      >   Remove product from favorite
// @Access Control   >   Private
router.delete("/:favorite_id", isAuthenticated, isAuthorized, deleteFavorite);

module.exports = router;
