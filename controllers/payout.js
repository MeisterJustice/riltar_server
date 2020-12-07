const Payout = require("../models/payout");
const cryptoRandomString = require("crypto-random-string");

exports.createPayout = ({ user, product, amount, customer }) => {
  return new Promise((fulfill, reject) => {
    Payout.create({
      user,
      product,
      customer,
      amount,
      reference: `payout-${cryptoRandomString({ length: 14 })}`,
    })
      .then((res) => {
        fulfill(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getPayouts = async (req, res, next) => {
  try {
    payouts = await Payout.find({}).sort({ createdAt: -1 }).lean().exec();
    return res.status(200).json(payouts);
  } catch (err) {
    return next(err);
  }
};

exports.getPayoutsForUser = async (req, res, next) => {
  try {
    payouts = await Payout.find({ user: req.params.user_id })
      .sort({ createdAt: -1 })
      .populate("product")
      .populate("customer", "firstName lastName")
      .lean()
      .exec();
    return res.status(200).json(payouts);
  } catch (err) {
    return next(err);
  }
};
