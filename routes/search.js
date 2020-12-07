const express = require("express");
const router = express.Router({ mergeParams: true });

const { searchProduct } = require("../controllers/search");

// @Route            >   GET  /api/v1/search/:search_param
// @Description      >   Search
// @Access Control   >   Public
router.get("/:search_param", searchProduct);

module.exports = router;
