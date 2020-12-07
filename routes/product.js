const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");
const {
  getAllproducts,
  getproduct,
  postProduct,
  productImage,
  updateProduct,
  deleteProduct,
  togglePause,
  getAllproductsOwnedByUser,
  getAllCheapProducts,
  getAllPopularProducts,
  getAllRecentViewedProducts,
  getBrowseProducts,
} = require("../controllers/product");

// @Route            >   GET  /api/v1/product
// @Description      >   Get all products
// @Access Control   >   Public
router.get("/", getAllproducts);

// @Route            >   GET  /api/v1/product/budget/:limit
// @Description      >   Get cheap products
// @Access Control   >   Public
router.get("/budget/:limit", getAllCheapProducts);

// @Route            >   GET  /api/v1/product/popular/:limit
// @Description      >   Get popular products
// @Access Control   >   Public
router.get("/popular/:limit", getAllPopularProducts);

// @Route            >   GET  /api/v1/product/browse/:limit
// @Description      >   Get browse products
// @Access Control   >   Public
router.get("/browse/:limit", getBrowseProducts);

// @Route            >   GET  /api/v1/product/:user_id
// @Description      >   Get all products owned by a user
// @Access Control   >   Private
router.get(
  "/:user_id",
  isAuthenticated,
  isAuthorized,
  getAllproductsOwnedByUser
);

// @Route            >   GET  /api/v1/product/:user_id/recent/:limit
// @Description      >   Get recently viewed products
// @Access Control   >   Private
router.get(
  "/:user_id/recent/:limit",
  isAuthenticated,
  isAuthorized,
  getAllRecentViewedProducts
);

// @Route            >   GET  /api/v1/product/:user_id/:limit/:subcategory_id
// @Description      >   Get similar products
// @Access Control   >   Private
router.get(
  "/:user_id/:limit/:subcategory_id",
  isAuthenticated,
  isAuthorized,
  getAllRecentViewedProducts
);

// @Route            >   GET  /api/v1/product/:user_id/:product_id
// @Description      >   Get a product
// @Access Control   >   Public
router.get("/:user_id/:product_id", getproduct);

// @Route            >   POST  /api/v1/product/:user_id
// @Description      >   Post a product
// @Access Control   >   Private
router.post("/:user_id", isAuthenticated, isAuthorized, postProduct);

// @Route            >   POST  /api/v1/product/:user_id/:product_id
// @Description      >   Post a product
// @Access Control   >   Private
router.put(
  "/:user_id/:product_id",
  isAuthenticated,
  isAuthorized,
  productImage
);

// @Route            >   PUT  /api/v1/product/:user_id/:product_id/update
// @Description      >   Update product post
// @Access Control   >   Private
router.put(
  "/:user_id/:product_id/update",
  isAuthenticated,
  isAuthorized,
  updateProduct
);

// @Route            >   PUT  /api/v1/product/:user_id/:product_id/pause
// @Description      >   Toggle isPause
// @Access Control   >   Private
router.put(
  "/:user_id/:product_id/pause",
  isAuthenticated,
  isAuthorized,
  togglePause
);

// @Route            >   DELETE  /api/v1/product/:user_id/:product_id
// @Description      >   Delete product
// @Access Control   >   Private
router.delete(
  "/:user_id/:product_id",
  isAuthenticated,
  isAuthorized,
  deleteProduct
);

module.exports = router;
