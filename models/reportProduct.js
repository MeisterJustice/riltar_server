const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reportProductSchema = new Schema({
    body: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    reference: {type: String}
}, {
    timestamps: true
});
reportProductSchema.index({ reportProduct: 1 })
module.exports = mongoose.model("ReportProduct", reportProductSchema);
