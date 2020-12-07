const Product = require("../models/product");
const Rating = require("../models/rating");
const Order = require("../models/order");
const User = require("../models/user");

exports.getRatings = async (req, res, next) => {
  try {
    let { product_id } = req.params;
    let ratings = await Rating.find({
      product: product_id,
    })
      .sort({ rating: 1, updatedAt: -1 })
      .populate("user", "firstName lastName username")
      .exec();
    return res.status(200).json(ratings);
  } catch (err) {
    return next(err);
  }
};

exports.getRatingsForUser = async (req, res, next) => {
  try {
    let { user_id } = req.params;
    let ratings = await Rating.find({
      user: user_id,
    })
      .sort({ rating: 1, updatedAt: -1 })
      .populate("product", "_id title images")
      .exec();
    return res.status(200).json(ratings);
  } catch (err) {
    return next(err);
  }
};

exports.getOrdersForUserToRate = async (req, res, next) => {
  try {
    let { user_id } = req.params;
    let orders = await Order.find({
      user: user_id,
      isReviewed: false,
      isDelivered: true,
      isCancelled: false,
    })
      .sort({ updatedAt: -1 })
      .populate("product", "_id images")
      .lean()
      .exec();
    return res.status(200).json(orders);
  } catch (err) {
    return next(err);
  }
};

exports.getCountOrdersForUserToRate = async (req, res, next) => {
  try {
    let { user_id } = req.params;
    let orders = await Order.estimatedDocumentCount({
      user: user_id,
      isReviewed: false,
      isDelivered: true,
      isCancelled: false,
    }).exec();
    return res.status(200).json({ count: orders });
  } catch (err) {
    return next(err);
  }
};

exports.postRating = async (req, res, next) => {
  try {
    let { user_id, product_id, order_id } = req.params;

    let product = await Product.findById(product_id)
      .populate("user", "_id")
      .exec();

    let order = await Order.findById(order_id);

    let productOwner = await User.findById(product.user.id)
      .sort({
        email: 1,
        totalNumRatings: 1,
        totalRating: 1,
        averageRating: 1,
        totalPositiveFeedback: 1,
        totalNegativeFeedback: 1,
      })
      .select({ _id: 1, email: 1 })
      .exec();

    let { rating, review, feedback } = req.body;
    let newRating = await Rating.create({
      rating,
      review,
      feedback,
      user: user_id,
      product: product.id,
    });

    // ============================================
    // ======= APPLY RABBITMQ FROM HERE ===========

    order.isReviewed = true;
    order.save();

    // update product
    product.ratings.push(newRating.id);
    product.totalRating += newRating.rating;
    product.averageRating = product.totalRating / product.ratings.length;
    product.save();
    // update user
    productOwner.totalRating += newRating.rating;
    productOwner.totalNumRatings += 1;
    productOwner.averageRating =
      productOwner.totalRating / productOwner.totalNumRatings;
    if (newRating.feedback === 1) productOwner.totalPositiveFeedback += 1;
    if (newRating.feedback === 0) productOwner.totalNegativeFeedback += 1;
    productOwner.feedback =
      ((productOwner.totalPositiveFeedback -
        productOwner.totalNegativeFeedback) /
        (productOwner.totalPositiveFeedback +
          productOwner.totalNegativeFeedback)) *
      100;
    productOwner.save();

    // ===========================================
    // ==========================================

    return res.status(200).json(newRating);
  } catch (err) {
    return next(err);
  }
};

exports.updateRating = async (req, res, next) => {
  try {
    let { rating_id, product_id } = req.params;

    let product = await Product.findById(product_id)
      .select({
        _id: 1,
        totalRating: 1,
        ratings: 1,
        averageRating: 1,
        user: 1,
      })
      .exec();

    let productOwner = await User.findById(product.user)
      .sort({ email: 1 })
      .select({
        _id: 1,
        email: 1,
        totalNumRatings: 1,
        totalRating: 1,
        averageRating: 1,
      })
      .exec();

    let { rating, review, feedback } = req.body;
    let foundRating = await Rating.findById(rating_id);
    // minus the previous ratings
    product.totalRating -= foundRating.rating;
    productOwner.totalRating -= foundRating.rating;
    // update rating
    foundRating.rating = rating;
    foundRating.review = review;
    foundRating.feedback = feedback;
    await foundRating.save();

    // ============================================
    // ======= APPLY RABBITMQ FROM HERE ===========

    product.totalRating += rating;
    product.averageRating = product.totalRating / product.ratings.length;
    product.save();
    // update user
    productOwner.totalRating += rating;
    productOwner.averageRating =
      productOwner.totalRating / productOwner.totalNumRatings;
    productOwner.save();

    // ==============================================
    // ==============================================

    return res.status(200).json(foundRating);
  } catch (err) {
    return next(err);
  }
};

exports.flagRating = async (req, res, next) => {
  try {
    let rating = await Rating.findByIdAndUpdate(
      req.params.rating_id,
      {
        isFlagged: true,
      },
      { new: true }
    );
    return res.status(200).json(rating);
  } catch (err) {
    return next(err);
  }
};
