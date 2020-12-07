const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const Order = require("../models/order");
const { createPayout } = require("./payout");

exports.getOrders = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const orders = await Order.find({
      user: user_id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "location phone")
      .populate("seller", "firstName lastName location phone")
      .populate("product", "title images")
      .lean()
      .exec();
    return res.status(200).json(orders);
  } catch (err) {
    return next(err);
  }
};

exports.getSells = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const orders = await Order.find({
      seller: user_id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName location phone")
      .populate("product", "title")
      .lean()
      .exec();
    return res.status(200).json(orders);
  } catch (err) {
    return next(err);
  }
};

exports.getUndeliveredSellsCount = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const orders = await Order.estimatedDocumentCount({
      seller: user_id,
      isDelivered: false,
    }).exec();
    return res.status(200).json({ count: orders });
  } catch (err) {
    return next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findById(order_id)
      .populate(
        "product",
        "_id title image quantity price condition totalRating"
      )
      .exec();
    return res.status(200).json(order);
  } catch (err) {
    return next(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const { cart_id, product_id, user_id } = req.params;
    const user = await User.findById(user_id)
      .sort({ email: 1, _id: 1 })
      .select({ address: 1, firstName: 1, lastName: 1, location: 1 })
      .exec();
    const product = await Product.findById(product_id);
    const productOwner = await User.findById(product.user)
      .sort({ email: 1, _id: 1 })
      .select({ numberOfSales: 1 })
      .exec();

    const cart = await Cart.findById(cart_id).populate("user", "_id").exec();
    const order = await Order.create({
      product: product.id,
      quantity: cart.quantity,
      price: cart.price,
      totalPrice: cart.totalPrice,
      user: user._id,
      seller: productOwner.id,
      paymentMethod: req.body.paymentMethod,
      isPaidFor: req.body.isPaidFor,
      isNegotiated: req.body.isNegotiated,
      reference: req.body.reference,
    });

    let address = [];
    for (var i = 0; i < user.location.length; i++) {
      if (user.location[i].isDefault === true) {
        address.push(user.location[i]);
      }
    }
    order.deliveryAddress.firstName = user.firstName;
    order.deliveryAddress.lastName = user.lastName;
    order.deliveryAddress.state = address[0].state;
    order.deliveryAddress.city = address[0].city;
    order.deliveryAddress.address = address[0].address;
    order.deliveryAddress.phone = address[0].phone;
    order.save();

    // update product
    product.quantity -= 1;
    product.totalOrders += 1;
    // pause product if quantity is zero
    if (product.quantity < 1) {
      product.isPaused = true;
    }
    product.quantitySold += 1;
    product.save();
    // update user
    productOwner.numberOfSales += 1;

    productOwner.save();
    // remove cart
    cart.remove();

    // =========================================
    // ========== APPLY RABBITMQ FROM HERE =====
    // =========================================

    return res.status(200).json(order);
  } catch (err) {
    return next(err);
  }
};

exports.confirmOrder = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id)
      .select({ _id: 1, seller: 1, totalPrice: 1 })
      .populate("product", "_id")
      .populate("user", "_id pin")
      .exec();

    const user = await User.findById(req.params.user_id)
      .select({
        numberOfCompletedOrders: 1,
        totalRevenue: 1,
      })
      .sort({ email: 1 })
      .exec();

    if (order.user.pin === req.body.pin) {
      order.isDelivered = true;
      order.dateDelivered = Date.now();
    } else {
      return next({
        status: 500,
        message: "Incorrect Pin!",
      });
    }
    await order.save();
    // then pay seller his money
    createPayout({
      user: user.id,
      customer: order.user._id,
      product: order.product._id,
      amount: order.totalPrice,
    });
    user.numberOfCompletedOrders += 1;
    user.totalRevenue += order.totalPrice;
    user.save();
    return res.status(200).json(order);
  } catch (err) {
    return next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id)
      .select({ _id: 1, seller: 1 })
      .exec();

    const user = await User.findById(order.seller)
      .select({
        numberOfCancelledOrders: 1,
      })
      .sort({ email: 1 })
      .exec();

    order.isCancelled = true;
    order.dateCancelled = Date.now();
    await order.save();

    user.numberOfCancelledOrders += 1;
    user.totalRevenue -= order.totalPrice;
    user.save();
    return res.status(200).json(order);
  } catch (err) {
    return next(err);
  }
};
