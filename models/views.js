const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const viewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seller: {
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
viewSchema.index({ createdAt: -1 });
module.exports = mongoose.model("View", viewSchema);
