const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const {
  getAllSupports,
  getNotRespondedSupports,
  getSupportById,
  getSupportByReference,
  getSupportsForUser,
  postSupport,
  respondSupport,
  closeSupport,
} = require("../controllers/support");

const { isAdmin } = require("../validation");

// @Route            >   GET  /api/v1/:user_id/support
// @Description      >   Get all supports
// @Access Control   >   Admin
router.get("/", isAuthenticated, isAuthorized, isAdmin, getAllSupports);

// @Route            >   GET  /api/v1/:user_id/support/user
// @Description      >   Get all supports for a user
// @Access Control   >   Private
router.get("/user", isAuthenticated, isAuthorized, getSupportsForUser);

// @Route            >   POST  /api/v1/:user_id/support/user
// @Description      >   Post support for user
// @Access Control   >   Private
router.post("/user", isAuthenticated, isAuthorized, postSupport);

// @Route            >   GET  /api/v1/:user_id/support/responded
// @Description      >   Get yet to be responded supports
// @Access Control   >   Admin
router.get(
  "/responded",
  isAuthenticated,
  isAuthorized,
  isAdmin,
  getNotRespondedSupports
);

// @Route            >   GET  /api/v1/:user_id/support/reference
// @Description      >   Get support by reference
// @Access Control   >   Admin
router.get(
  "/reference",
  isAuthenticated,
  isAuthorized,
  isAdmin,
  getSupportByReference
);

// @Route            >   GET  /api/v1/:user_id/support/:support_id
// @Description      >   Get support by id
// @Access Control   >   Admin
router.get(
  "/:support_id",
  isAuthenticated,
  isAuthorized,
  isAdmin,
  getSupportById
);

// @Route            >   PUT  /api/v1/:user_id/support/:support_id/:customer_id/respond
// @Description      >   Respond to a support ticket
// @Access Control   >   Admin
router.put(
  "/:support_id/:customer_id/respond",
  isAuthenticated,
  isAuthorized,
  isAdmin,
  respondSupport
);

// @Route            >   PUT  /api/v1/:user_id/support/:support_id/:customer_id/close
// @Description      >   Get support by id
// @Access Control   >   Admin
router.get(
  "/:support_id/:customer_id/close",
  isAuthenticated,
  isAuthorized,
  isAdmin,
  closeSupport
);

module.exports = router;
