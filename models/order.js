const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    deliveryAddress: {
      firstName: String,
      lastName: String,
      country: { type: String, default: "Nigeria" },
      state: String,
      city: String,
      address: String,
      phone: Number,
    },

    quantity: { type: Number, default: 1 },
    price: Number,
    totalPrice: Number,
    commission: Number,
    isPaidFor: { type: Boolean, default: true },
    paymentMethod: { type: String, default: "Card Payment" },
    isNegotiated: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reference: { type: String, unique: true },
    isDelivered: { type: Boolean, default: false },
    dateDelivered: { type: Date },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    dateCancelled: { type: Date },
    isReviewed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
orderSchema.index({ reference: 1, createdAt: -1 });
module.exports = mongoose.model("Order", orderSchema);
