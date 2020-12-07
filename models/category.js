const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    title: String,
    numberOfVisits: { type: Number, default: 0 },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);
categorySchema.index({ title: 1, createdAt: -1 });
module.exports = mongoose.model("Category", categorySchema);
