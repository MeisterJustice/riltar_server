const express = require("express");
const router = express.Router({ mergeParams: true });

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const {
  createMessage,
  getMessageHistory,
  getRoom,
  getRooms,
  getLastRooms,
  replyMessage,
} = require("../controllers/message");

// @Route            >   GET  /api/v1/message/:user_id/room
// @Description      >   Get all rooms for a particular user
// @Access Control   >   Private
router.get("/:user_id/room", isAuthenticated, isAuthorized, getRooms);

// @Route            >   GET  /api/v1/message/:user_id/room/last
// @Description      >   Get last rooms for a particular user
// @Access Control   >   Private
router.get("/:user_id/room/last", isAuthenticated, isAuthorized, getLastRooms);

// @Route            >   GET  /api/v1/message/:user_id/room/:room_id
// @Description      >   Get a room
// @Access Control   >   Private
router.get("/:user_id/room/:room_id", isAuthenticated, isAuthorized, getRoom);

// @Route            >   GET  /api/v1/message/:user_id/history/:room_id
// @Description      >   Get conversation
// @Access Control   >   Private
router.get(
  "/:user_id/history/:room_id",
  isAuthenticated,
  isAuthorized,
  getMessageHistory
);

// @Route            >   POST  /api/v1/message/:user_id/room/:seller_id/:product_id
// @Description      >   Post a room
// @Access Control   >   Private
router.post(
  "/:user_id/room/:seller_id/:product_id",
  isAuthenticated,
  isAuthorized,
  createMessage
);

// @Route            >   POST  /api/v1/message/:user_id/history/:room_id/:recepient_id
// @Description      >   Reply Message
// @Access Control   >   Private
router.post(
  "/:user_id/history/:room_id/:recepient_id",
  isAuthenticated,
  isAuthorized,
  replyMessage
);

module.exports = router;
