const Favorite = require("../models/favorite");
const cryptoRandomString = require("crypto-random-string");

exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({
      user: req.params.user_id,
    })
      .sort({ reference: 1, createdAt: -1 })
      .populate({
        path: "product",
        select: {
          title: 1,
          images: 1,
          isPaused: 1,
          condition: 1,
          quantity: 1,
          price: 1,
          isNegotiable: 1,
          averageRating: 1,
          ratings: 1,
        },
        populate: {
          path: "user",
          select: {
            firstName: 1,
            lastName: 1,
            username: 1,
            feedback: 1,
          },
        },
      })
      .lean()
      .exec();
    return res.status(200).json(favorites);
  } catch (err) {
    return next(err);
  }
};

exports.postFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.create({
      user: req.params.user_id,
      product: req.params.product_id,
      reference: cryptoRandomString({ length: 7 }),
    });
    return res.status(200).json(favorite);
  } catch (err) {
    return next(err);
  }
};

exports.deleteFavorite = async (req, res, next) => {
  try {
    const favorite = Favorite.findByIdAndRemove(req.params.favorite_id);
    return res.status(200).json(favorite);
  } catch (err) {
    return next(err);
  }
};
