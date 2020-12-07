const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema(
  {
    isRead: { type: Boolean, default: false },
    channel: String, // product_id + seller_id + customer_id
    lastMessage: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    isAdmin: { type: Boolean, default: false },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sellerToRead: {type: Number, default: 0},
    customerToRead: {type: Number, default: 0},
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Room", roomSchema);
