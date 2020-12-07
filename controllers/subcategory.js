const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

exports.getAllSubcategories = async (req, res, next) => {
  try {
    let subcategory = await Subcategory.find({})
      .populate("category")
      .lean()
      .exec();

    return res.status(200).json(subcategory);
  } catch (err) {
    return next(err);
  }
};

exports.getSubcategory = async (req, res, next) => {
  try {
    let { subcategory_id } = req.params;

    let subcategory = await Subcategory.find({
      _id: subcategory_id,
    })
      .populate({
        path: "products",
        populate: { path: "user" },
        populate: { path: "ratings" },
      })
      .exec();

    return res.status(200).json(subcategory);
  } catch (err) {
    return next(err);
  }
};

exports.postSubcategory = async (req, res, next) => {
  try {
    let category_id = req.params.category_id;
    let category = await Category.findById(category_id);

    let { title } = req.body;
    let subcategory = await Subcategory.create({
      title,
      category,
    });

    category.subCategories.push(subcategory);
    await category.save();

    return res.status(200).json(subcategory);
  } catch (err) {
    return next(err);
  }
};

exports.updatesubcategory = async (req, res, next) => {
  try {
    let { subcategory_id } = req.params;
    let { title, description, modelIsRequired } = req.body;
    let subcategory = await Subcategory.findByIdAndUpdate(
      subcategory_id,
      {
        title,
        description,
        modelIsRequired,
      },
      { new: true }
    );

    return res.status(200).json(subcategory);
  } catch (err) {
    return next(err);
  }
};
