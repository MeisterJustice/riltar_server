const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const cryptoRandomString = require("crypto-random-string");

exports.getCarts = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const cartItems = await Cart.find({
      user: user_id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        select: {
          images: 1,
          title: 1,
          condition: 1,
          averageRating: 1,
          quantity: 1,
          _id: 1,
          isDeleted: 1,
          isPaused: 1,
        },
        populate: {
          path: "user",
          select: {
            username: 1,
            _id: 1,
            firstName: 1,
            lastName: 1,
            isBusiness: 1,
          },
        },
      })
      .exec();
    return res.status(200).json(cartItems);
  } catch (err) {
    return next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const { cart_id } = req.params;
    const cart = await Cart.findById(cart_id)
      .populate({
        path: "product",
        select: {
          images: 1,
          title: 1,
          condition: 1,
          averageRating: 1,
          quantity: 1,
          isDeleted: 1,
          isPaused: 1,
          isNegotiable: 1,
        },
        populate: {
          path: "user",
          select: {
            isBusiness: 1,
            firstName: 1,
            username: 1,
            lastName: 1,
            phone: 1,
          },
        },
      })
      .exec();
    return res.status(200).json(cart);
  } catch (err) {
    return next(err);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const { user_id, product_id } = req.params;
    const product = await Product.findById(product_id);

    // if (product.isDeleted || product.isPaused) {
    //   return next({
    //     status: 500,
    //     message: "product not available",
    //   });
    // } else {
    const cart = await Cart.create({
      product: product_id,
      price: req.body.price ? req.body.price : product.price,
      totalPrice: req.body.price ? req.body.price : product.price,
      user: user_id,
      reference: `cart-${cryptoRandomString({ length: 12 })}`,
    });
    return res.status(200).json(cart);
    // }
  } catch (err) {
    return next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { cart_id } = req.params;
    const cart = await Cart.findById(cart_id)
      .select("-updatedAt")
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        select: {
          images: 1,
          title: 1,
          condition: 1,
          quantity: 1,
          averageRating: 1,
          _id: 1,
          isDeleted: 1,
          isPaused: 1,
        },
        populate: {
          path: "user",
          select: {
            username: 1,
            _id: 1,
            firstName: 1,
            lastName: 1,
            isBusiness: 1,
          },
        },
      })
      .exec();
    cart.quantity = req.body.quantity;
    cart.totalPrice = cart.price * req.body.quantity;
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    return next(err);
  }
};

exports.applyCouponAndUpdateCart = async (req, res, next) => {
  try {
    const { cart_id, user_id } = req.params;
    let coupon = await Coupon.find({
      code: req.body.coupon.toUpperCase(),
    })
      .sort({ createdAt: -1 })
      .exec();
    if (coupon.quantity < 1) {
      return next({
        status: 400,
        message: "this coupon has been used off",
      });
    } else {
      if (coupon.to >= Date.now()) {
        return next({
          status: 400,
          message: "this coupon has expired",
        });
      } else {
        if (coupon.includes(user_id)) {
          return next({
            status: 400,
            message: "you can not use this coupon twice",
          });
        } else {
          const cart = await Cart.findById(cart_id);
          cart.totalPrice = (cart.totalPrice / 100) * coupon.percentOff;
          await cart.save();
          coupon.quantity -= 1;
          coupon.users.push(user_id);
          await coupon.save();
          return res.status(200).json(cart);
        }
      }
    }
  } catch (err) {
    return next(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const { cart_id } = req.params;
    const cart = await Cart.findByIdAndRemove(cart_id);
    return res.status(200).json(cart);
  } catch (err) {
    return next(err);
  }
};
