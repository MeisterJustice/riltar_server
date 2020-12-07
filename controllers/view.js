const View = require("../models/views");

exports.createView = ({ user, product, seller }) => {
  return new Promise((fulfill, reject) => {
    View.create({
      user,
      product,
      seller,
    })
      .then((res) => {
        fulfill(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getViews = async (req, res, next) => {
  try {
    views = await View.find({}).sort({ createdAt: -1 }).lean().exec();
    return res.status(200).json(views);
  } catch (err) {
    return next(err);
  }
};

exports.getViewsForUser = async (req, res, next) => {
  try {
    views = await View.find({ user: req.params.user_id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(views);
  } catch (err) {
    return next(err);
  }
};

exports.getViewsForAUserProducts = async (req, res, next) => {
  try {
    views = await View.find({
      seller: req.params.user_id,
    })
      .select("createdAt")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(views);
  } catch (err) {
    return next(err);
  }
};

exports.getLimitedViews = async (req, res, next) => {
  try {
    let { limit } = Number(req.params.limit);
    views = await View.find({})
      .populate({
        path: "product",
        select: { _id: 1, user: 1 },
      })
      .where("product.user")
      .equals(req.params.user_id)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return res.status(200).json(views);
  } catch (err) {
    return next(err);
  }
};
