const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  findUser,
  updateUser,
  updateUserBankDetails,
  updateUserIdentification,
  removeUser,
  updatePassword,
  addUserAddress,
  updateUserAddress,
} = require("../controllers/user");
const { isAuthenticated, isAuthorized } = require("../middleware/auth");

// @Route            >   GET  /api/v1/user/
// @Description      >   Get All Users
// @Access Control   >   Admin

// @Route            >   GET  /api/v1/user/:user_id
// @Description      >   Get a User
// @Access Control   >   Public
router.get("/:user_id", findUser);

// @Route            >   PUT  /api/v1/user/:user_id/details
// @Description      >   Update user details
// @Access Control   >   Private
router.put("/:user_id/details", isAuthenticated, isAuthorized, updateUser);

// @Route            >   PUT  /api/v1/user/:user_id/bank
// @Description      >   Update user bank info
// @Access Control   >   Private
router.put(
  "/:user_id/bank",
  isAuthenticated,
  isAuthorized,
  updateUserBankDetails
);

// @Route            >   PUT  /api/v1/user/:user_id/address
// @Description      >   Update user address info
// @Access Control   >   Private
router.put("/:user_id/address", isAuthenticated, isAuthorized, addUserAddress);

// @Route            >   PUT  /api/v1/user/:user_id/address/update
// @Description      >   Update user address info
// @Access Control   >   Private
router.put(
  "/:user_id/address/update",
  isAuthenticated,
  isAuthorized,
  updateUserAddress
);

// @Route            >   PUT  /api/v1/user/:user_id/identification
// @Description      >   Update user identification details
// @Access Control   >   Private
router.put(
  "/:user_id/identification",
  isAuthenticated,
  isAuthorized,
  updateUserIdentification
);

// @Route            >   PUT  /api/v1/user/:user_id/password
// @Description      >   Update password
// @Access Control   >   Private
router.put("/:user_id/password", isAuthenticated, isAuthorized, updatePassword);

// @Route            >   PUT  /api/v1/user/:user_id/remove
// @Description      >   Remove user
// @Access Control   >   Private
router.put("/:user_id/remove", isAuthenticated, isAuthorized, removeUser);

module.exports = router;
