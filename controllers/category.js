const Category = require("../models/category");

exports.getAllCategories = async (req, res, next) => {
  try {
    let category = await Category.find({});
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    let category_id = req.params.category_id;
    let category = await Category.findById({ _id: category_id })
      .populate("subCategories", {
        _id: true,
        title: true,
      })
      .exec();
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};

exports.postCategory = async (req, res, next) => {
  try {
    let { title } = req.body;
    let category = await Category.create({ title });
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    let { title } = req.body;
    let category_id = req.params.category_id;
    let category = await Category.findByIdAndUpdate(
      category_id,
      { title },
      { new: true }
    );
    return res.status(200).json(category);
  } catch (err) {
    return next(err);
  }
};
