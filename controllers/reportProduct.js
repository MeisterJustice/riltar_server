const Product = require("../models/product");
const User = require("../models/user");
const ReportProduct = require("../models/reportProduct");

exports.getReports = async (req, res, next) => {
  try {
    let { product_id } = req.params;
    let reports = await ReportProduct.find({
      product: product_id,
    });
    return res.status(200).json(reports);
  } catch (err) {
    return next(err);
  }
};

exports.postReport = async (req, res, next) => {
  try {
    let { user_id, product_id } = req.params;

    let product = await Product.findById(product_id)
      .populate("user", "_id")
      .exec();

    let productOwner = await User.findById(product.user.id)
      .sort({ email: 1 })
      .select({ _id: 1, numberOfReports: 1 })
      .exec();

    let { body } = req.body;
    let newReport = await ReportProduct.create({
      body,
      user: user_id,
      product: product.id,
    });

    // ============================================
    // ======= APPLY RABBITMQ FROM HERE ===========

    // update product
    product.reports.push(newReport.id);
    await product.save();
    // update user
    productOwner.numberOfReports += 1;
    await productOwner.save();

    // ===========================================
    // ==========================================

    return res.status(200).json(newReport);
  } catch (err) {
    return next(err);
  }
};
