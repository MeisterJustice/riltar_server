const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const couponSchema = new Schema({
    code: { type: String, uppercase: true, unique: true },
    percentOff: Number,
    from: { type: Date },
    to: { type: Date },
    quantity: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    ]
}, {
    timestamps: true
});
module.exports = mongoose.model("Coupon", couponSchema);
