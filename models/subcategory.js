const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subcategorySchema = new Schema(
  {
    title: String,
    description: String,
    numberOfVisits: { type: Number, default: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);
subcategorySchema.index({ title: 1, createdAt: -1 });
module.exports = mongoose.model("Subcategory", subcategorySchema);
