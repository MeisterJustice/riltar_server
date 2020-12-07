const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const payoutSchema = new Schema(
  {
    amount: Number,
    reference: { type: String, unique: true },
    status: { type: String, default: "successful" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);
payoutSchema.index({ createdAt: -1 });
module.exports = mongoose.model("Payout", payoutSchema);
