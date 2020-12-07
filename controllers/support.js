const Support = require("../models/support");
const User = require("../models/user");
const { sendEmailWithoutTemplate } = require("../controllers/email");
const cryptoRandomString = require("crypto-random-string");

exports.getAllSupports = async (req, res, next) => {
  try {
    let supports = await Support.find({}).sort({ createdAt: -1 }).lean().exec();
    return res.status(200).json(supports);
  } catch (err) {
    return next(err);
  }
};

exports.getNotRespondedSupports = async (req, res, next) => {
  try {
    let supports = await Support.find({
      isResponded: false,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(supports);
  } catch (err) {
    return next(err);
  }
};

exports.getSupportsForUser = async (req, res, next) => {
  try {
    let supports = await Support.find({
      user: req.params.user_id,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(supports);
  } catch (err) {
    return next(err);
  }
};

exports.getSupportById = async (req, res, next) => {
  try {
    let { support_id } = req.params;
    let support = await Support.findById(support_id)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(support);
  } catch (err) {
    return next(err);
  }
};

exports.getSupportByReference = async (req, res, next) => {
  try {
    let { reference } = req.body;
    let support = await Support.find({
      reference,
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return res.status(200).json(support);
  } catch (err) {
    return next(err);
  }
};

exports.postSupport = async (req, res, next) => {
  try {
    let user = req.params.user_id;
    let { title, body } = req.body;
    let support = await Support.create({
      title,
      body,
      user,
      reference: `support-${cryptoRandomString({ length: 11 })}`,
    });

    return res.status(200).json(support);
  } catch (err) {
    return next({
      status: 500,
      message: "an error occured. Please try again",
    });
  }
};

exports.respondSupport = async (req, res, next) => {
  try {
    let { body, subject } = req.body;
    let { user_id, customer_id, support_id } = req.params;
    let admin = await User.findById(user_id)
      .sort({ email: 1, createdAt: -1 })
      .lean()
      .exec();
    let customer = await User.findById(customer_id)
      .sort({ email: 1, createdAt: -1 })
      .lean()
      .exec();
    let support = await Support.findById(support_id)
      .sort({ createdAt: -1 })
      .exec();

    // ================================================================
    // ================ APPLY RABBITMQ FROM HERE ======================
    // ================================================================
    support.isResponded = true;
    support.respond.by = `${admin.firstName} ${admin.lastName}`;
    support.respond.date = Date.now();
    await support.save();

    const data = {
      to: customer.email,
      subject,
      body,
    };
    sendEmailWithoutTemplate(data);

    return res.status(200).json(support);
  } catch (err) {
    return next(err);
  }
};

exports.closeSupport = async (req, res, next) => {
  try {
    let { user_id, support_id, customer_id } = req.params;
    let admin = await User.findById(user_id)
      .sort({ email: 1, createdAt: -1 })
      .lean()
      .exec();

    let support = await Support.findById(support_id)
      .sort({ createdAt: -1 })
      .exec();

    // ================================================================
    // ================ APPLY RABBITMQ FROM HERE ======================
    // ================================================================
    support.isActive = false;
    support.close.by = `${admin.firstName} ${admin.lastName}`;
    support.close.date = Date.now();
    await support.save();

    return res.status(200).json(support);
  } catch (err) {
    return next(err);
  }
};
