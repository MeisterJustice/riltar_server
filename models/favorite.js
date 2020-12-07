const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    reference: String
}, {
    timestamps: true
});
favoriteSchema.index({ reference: 1, createdAt: -1 })
module.exports = mongoose.model("Favorite", favoriteSchema);
