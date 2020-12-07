const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    title: String,
    body: String,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead: {type: Boolean, default: false},
    reference: String,
}, {
    timestamps: true
});
notificationSchema.index({ reference: 1, createdAt: -1 })
module.exports = mongoose.model("Notification", notificationSchema);
