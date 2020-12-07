const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    title: String,
    description: String,
    images: [String],
    categoryName: String,
    subcategoryName: String,
    isPaused: { type: Boolean, default: true },
    live: {
      isLive: { type: Boolean, default: false },
      by: String,
      date: Date,
    },
    condition: String, //if it's used, brandNew or refurbished.
    secondCondition: String, //if it's cracked or no problem with it.
    price: { type: Number, default: 0 },
    isNegotiable: { type: Boolean, default: false },
    negotiableMinRange: { type: Number },
    metaData: [
      {
        type: Map,
        of: String,
      },
    ],
    quantity: { type: Number, default: 0 },
    quantitySold: { type: Number, default: 0 },
    bids: { type: Number, default: 0 },
    reference: String,
    tags: [String],
    state: String,
    city: String,
    location: String,
    isDeleted: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    buyers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    totalViews: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    averageRating: { type: Number, min: 1, max: 5 },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReportProduct",
      },
    ],
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index(
  {
    title: "text",
    description: "text",
    condition: "text",
    secondCondition: "text",
    tags: "text",
    state: "text",
    categoryName: "text",
    subcategoryName: "text",
  },
  {
    weights: {
      title: 12,
      description: 6,
      condition: 5,
      secondCondition: 2,
      tags: 8,
      state: 1,
      categoryName: 10,
      subcategoryName: 9,
    },
    name: "searchIndex",
  }
);
module.exports = mongoose.model("Product", productSchema);
