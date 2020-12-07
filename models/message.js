const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema(
  {
    message: { type: String, required: true },
    isFlagged: { type: Boolean, default: false },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recepient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    offer: Number,
    isAccepted: { type: Boolean, default: false },
    containsOffer: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Message", messageSchema);
