const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated } = require("../middleware/auth");
const { isAdmin } = require("../validation");
const {
  getAllSubcategories,
  getSubcategory,
  postSubcategory,
  updatesubcategory,
} = require("../controllers/subcategory");

// @Route            >   GET  /api/v1/subcategory
// @Description      >   Get all subcategories
// @Access Control   >   Public
router.get("/", getAllSubcategories);

// @Route            >   GET  /api/v1/subcategory/:subcategory_id
// @Description      >   Get a subcategory
// @Access Control   >   Public
router.get("/:subcategory_id", getSubcategory);

// @Route            >   POST  /api/v1/subcategory/:user_id/:category_id
// @Description      >   Update subcategory
// @Access Control   >   Admin
router.post(
  "/:user_id/:category_id",
  isAuthenticated,
  isAdmin,
  postSubcategory
);

// @Route            >   PUT  /api/v1/subcategory/:user_id/:category_id/:subcategory_id
// @Description      >   Update subcategory
// @Access Control   >   Admin
router.put(
  "/:user_id/:category_id/:subcategory_id",
  isAuthenticated,
  isAdmin,
  updatesubcategory
);

module.exports = router;
