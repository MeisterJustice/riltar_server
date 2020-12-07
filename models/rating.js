const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ratingSchema = new Schema({
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    feedback: { type: Number, default: 1, min: 0, max: 1 },
    isFlagged: { type: Boolean, default: false, },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
}, {
    timestamps: true
});
ratingSchema.index({ rating: 1 })
module.exports = mongoose.model("Rating", ratingSchema);
