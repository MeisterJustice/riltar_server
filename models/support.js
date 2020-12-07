const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const supportSchema = new Schema({
    title: String,
    body: String,
    isResponded: { type: Boolean, default: false, },
    respond: {
        by: String,
        date: Date
    },
    isActive: { type: Boolean, default: true, },
    close: {
        by: String,
        date: Date
    },
    reference: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});
module.exports = mongoose.model("Support", supportSchema);
