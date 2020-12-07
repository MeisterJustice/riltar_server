const Coupon = require('../models/coupon');
const cryptoRandomString = require('crypto-random-string');


exports.getCoupons = async (req, res, next) => {
    try {
        let coupons = await Coupon.find({})
            .sort({ createdAt: -1 })
            .populate('category')
            .populate('user', '_id firstName lastName')
            .lean()
            .exec();
        return res.status(200).json(coupons);
    } catch (err) {
        next(err);
    }
}

exports.postCoupon = async (req, res, next) => {
    try {
        let {
            from,
            to,
            quantity,
            percentOff
        } = req.body;
        let coupon = await Coupon.create({
            code: cryptoRandomString({ length: 7 }),
            from,
            to,
            quantity,
            percentOff,
            user: req.params.user_id,
        })
        return res.status(200).json(coupon);
    } catch (err) {
        next(err);
    }
}

exports.updateCoupon = async (req, res, next) => {
    try {
        let {
            to,
            quantity
        } = req.body;
        let coupon = await Coupon.findByIdAndUpdate(req.params.coupon_id, {
            to,
            quantity,
        })
        return res.status(200).json(coupon);
    } catch (err) {
        next(err);
    }
}


exports.deleteCoupon = async (req, res, next) => {
    try {
        let coupon = await Coupon.findByIdAndRemove(req.params.coupon_id);
        return res.status(200).json(coupon);
    } catch (err) {
        next(err);
    }
}