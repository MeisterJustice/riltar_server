const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const { getPayouts, getPayoutsForUser } = require("../controllers/payout");

const { isAdmin } = require("../validation");

// @Route            >   GET  /api/v1/payouts
// @Description      >   Get all payouts
// @Access Control   >   Admin
router.get("/", isAuthenticated, isAdmin, getPayouts);

// @Route            >   GET  /api/v1/payout/:user_id
// @Description      >   Get all payouts for a particular user
// @Access Control   >   Private
router.get("/:user_id", isAuthenticated, isAuthorized, getPayoutsForUser);

module.exports = router;
